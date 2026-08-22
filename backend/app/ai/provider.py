"""
LLM provider abstraction.

The rest of the app calls `get_ai_provider().complete(...)` and never talks
to a vendor SDK directly. Swapping providers means adding a class here and
changing AI_PROVIDER in .env — no other file changes.
"""
from abc import ABC, abstractmethod
from app.config import settings


class AIProvider(ABC):
    @abstractmethod
    def complete(self, system: str, messages: list[dict], max_tokens: int = 800) -> str:
        """messages: [{"role": "user"|"assistant", "content": str}, ...]"""
        raise NotImplementedError


class AnthropicProvider(AIProvider):
    def __init__(self):
        import anthropic
        if not settings.anthropic_api_key:
            raise RuntimeError("ANTHROPIC_API_KEY is not set in the environment")
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.ai_model

    def complete(self, system: str, messages: list[dict], max_tokens: int = 800) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system,
            messages=messages,
        )
        return "".join(block.text for block in response.content if block.type == "text")


class EchoProvider(AIProvider):
    """
    Fallback provider used when no AI_API_KEY is configured, so local dev
    and demos don't hard-crash. Never used if a real key is present.
    """
    def complete(self, system: str, messages: list[dict], max_tokens: int = 800) -> str:
        return (
            "Thanks for sharing that. Our AI concierge isn't fully configured yet — "
            "could you tell me a bit more about your space, and a designer will follow up shortly?"
        )


class MockOpenAIProvider(AIProvider):
    def complete(self, system: str, messages: list[dict], max_tokens: int = 800) -> str:
        import json
        import re

        last_user_msg = ""
        for m in reversed(messages):
            if m["role"] == "user":
                last_user_msg = m["content"].strip()
                break

        last_assistant_msg = ""
        for m in reversed(messages[:-1]):  # exclude the last user message
            if m["role"] == "assistant":
                last_assistant_msg = m["content"].lower()
                break

        known_block = {}
        if "Known fields so far:" in system:
            try:
                json_str = system.split("Known fields so far:\n")[-1].strip()
                known_block = json.loads(json_str)
            except:
                pass

        fields = {**known_block}

        last_msg_lower = last_user_msg.lower()

        # 1. Check if the user is asking a question or changing the topic (off-topic / query detection)
        is_query = False
        query_response = ""

        # Check if they are asking about packages/pricing/cost
        if any(w in last_msg_lower for w in ["cost", "price", "pricing", "package", "packages", "rate", "rates"]):
            is_query = True
            query_response = (
                "We offer 3 primary interior packages tailored to your budget:\n"
                "- **Standard** (₹1,000-₹1,500/sq.ft): Smart, high-quality finishes, perfect for modern apartments.\n"
                "- **Premium** (₹1,800-₹2,500/sq.ft): Custom modular woodwork, false ceilings, lighting, and designer styling.\n"
                "- **Luxury** (₹3,500+/sq.ft): Elite Italian marbles, premium veneers, and automated systems.\n\n"
            )
        # Check if they want to see a specific service portfolio (and we didn't just ask about it)
        elif "villa" in last_msg_lower and not ("type of property" in last_assistant_msg):
            is_query = True
            fields["property_type"] = "Villa"
            query_response = (
                "For villas, we specialize in premium **Full Home Turnkey Interiors**, from modular layouts to custom stone paneling.\n"
                "Here is one of our premium villa living rooms:\n"
                "![YAVI Villa Project](/images/services/villa.jpg)\n"
                "👉 [View our Villa Portfolio](/projects/modern-villa-chennai)\n\n"
            )
        elif ("apartment" in last_msg_lower or "flat" in last_msg_lower) and not ("type of property" in last_assistant_msg):
            is_query = True
            fields["property_type"] = "Apartment"
            query_response = (
                "For apartments, we design **space-maximizing modular furniture** and custom wall treatments to make the space feel large and open.\n"
                "Here is a living room we designed:\n"
                "![YAVI Apartment Project](/images/services/apartment.jpg)\n"
                "👉 [View our Apartment Portfolio](/projects/contemporary-apartment-3bhk)\n\n"
            )
        elif "kitchen" in last_msg_lower and not ("type of property" in last_assistant_msg):
            is_query = True
            fields["property_type"] = "Kitchen"
            query_response = (
                "Our **Modular Kitchens** feature premium Hettich/Blum hardware, acrylic finishes, and smart organizers.\n"
                "Check out this dream kitchen design:\n"
                "![YAVI Modular Kitchen](/images/services/kitchen.jpg)\n\n"
            )
        elif ("office" in last_msg_lower or "commercial" in last_msg_lower or "corporate" in last_msg_lower) and not ("type of property" in last_assistant_msg):
            is_query = True
            fields["property_type"] = "Office"
            query_response = (
                "For corporate spaces, we provide end-to-end **Office Fitouts** designed for productivity and brand identity.\n"
                "Here is one of our executive reception designs:\n"
                "![YAVI Office Project](/images/services/office.jpg)\n"
                "👉 [View our Office Fitout Projects](/projects/boutique-office-fitout)\n\n"
            )

        # 2. If it's a real response, extract and validate fields
        if last_assistant_msg and not is_query:
            # Common refusal/skip keywords
            refusals = ["no", "nope", "skip", "no need", "private", "not sharing", "sorry no", "don't want", "dont want", "later"]
            is_refusal = any(r == last_msg_lower or last_msg_lower.startswith(r + " ") for r in refusals)

            if "name, please" in last_assistant_msg or "know your name" in last_assistant_msg:
                if is_refusal:
                    fields["name"] = "Valued Customer"
                elif len(last_user_msg.split()) <= 4:
                    clean_name = re.sub(r'^(my name is|i am|this is|i\'m)\s+', '', last_msg_lower).strip().title()
                    fields["name"] = clean_name

            elif "where are you located" in last_assistant_msg or "share your location" in last_assistant_msg:
                if is_refusal:
                    fields["location"] = "Not Shared"
                elif len(last_user_msg.split()) <= 4:
                    clean_loc = re.sub(r'^(i am in|i live in|located in|in|at)\s+', '', last_msg_lower).strip().title()
                    fields["location"] = clean_loc

            elif "type of property" in last_assistant_msg:
                if "apartment" in last_msg_lower or "flat" in last_msg_lower:
                    fields["property_type"] = "Apartment"
                elif "villa" in last_msg_lower or "house" in last_msg_lower or "home" in last_msg_lower:
                    fields["property_type"] = "Villa"
                elif "office" in last_msg_lower or "studio" in last_msg_lower or "commercial" in last_msg_lower:
                    fields["property_type"] = "Office"
                elif is_refusal:
                    fields["property_type"] = "Not Specified"
                elif len(last_user_msg.split()) <= 4:
                    fields["property_type"] = last_user_msg.title()

            elif "design style" in last_assistant_msg:
                if is_refusal:
                    fields["design_style"] = "Not Specified"
                elif len(last_user_msg.split()) <= 6:
                    fields["design_style"] = last_user_msg.title()

            elif "approximate budget" in last_assistant_msg:
                if is_refusal:
                    fields["budget"] = "Not Specified"
                elif len(last_user_msg.split()) <= 6:
                    fields["budget"] = last_user_msg

            elif "email address" in last_assistant_msg:
                email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', last_msg_lower)
                if email_match:
                    fields["email"] = email_match.group(0)
                elif is_refusal:
                    fields["email"] = "notshared@yavi.studio"

            elif "phone number" in last_assistant_msg:
                phone_match = re.search(r'\b\d{10}\b', last_msg_lower)
                if phone_match:
                    fields["phone"] = phone_match.group(0)
                elif is_refusal:
                    fields["phone"] = "0000000000"

        # Fallback quick keyword extraction (if they volunteer info out of order)
        if not fields.get("property_type"):
            if "apartment" in last_msg_lower or "flat" in last_msg_lower:
                fields["property_type"] = "Apartment"
            elif "villa" in last_msg_lower or "house" in last_msg_lower:
                fields["property_type"] = "Villa"
            elif "office" in last_msg_lower or "commercial" in last_msg_lower:
                fields["property_type"] = "Office"

        if not fields.get("email"):
            email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', last_msg_lower)
            if email_match:
                fields["email"] = email_match.group(0)

        if not fields.get("phone"):
            phone_match = re.search(r'\b\d{10}\b', last_msg_lower)
            if phone_match:
                fields["phone"] = phone_match.group(0)

        # Decide missing fields based on the checklist
        # Determine service info/image if user mentions a service type
        service_prefix = ""
        if "villa" in last_msg_lower:
            fields["property_type"] = "Villa"
            service_prefix = (
                "For villas, we specialize in premium **Full Home Turnkey Interiors**, handling everything from layout changes to custom paneling.\n\n"
                "Here is one of our premium villa living rooms:\n"
                "![YAVI Villa Project](/images/services/villa.jpg)\n"
                "👉 [View our Villa Portfolio](/projects/modern-villa-chennai)\n\n"
            )
        elif "apartment" in last_msg_lower or "flat" in last_msg_lower:
            fields["property_type"] = "Apartment"
            service_prefix = (
                "For apartments, we design **space-maximizing modular furniture** and custom wall treatments to make the space feel large and open.\n\n"
                "Here is a living room we designed:\n"
                "![YAVI Apartment Project](/images/services/apartment.jpg)\n"
                "👉 [View our Apartment Portfolio](/projects/contemporary-apartment-3bhk)\n\n"
            )
        elif "kitchen" in last_msg_lower:
            fields["property_type"] = "Kitchen"
            service_prefix = (
                "Our **Modular Kitchens** feature premium Hettich/Blum hardware, acrylic finishes, and smart organizers.\n\n"
                "Check out this dream kitchen design:\n"
                "![YAVI Modular Kitchen](/images/services/kitchen.jpg)\n\n"
            )
        elif "office" in last_msg_lower or "commercial" in last_msg_lower or "corporate" in last_msg_lower or "workspace" in last_msg_lower:
            fields["property_type"] = "Office"
            service_prefix = (
                "For corporate spaces, we provide end-to-end **Office Fitouts** designed for productivity and brand identity.\n\n"
                "Here is one of our executive reception designs:\n"
                "![YAVI Office Project](/images/services/office.jpg)\n"
                "👉 [View our Office Fitout Projects](/projects/boutique-office-fitout)\n\n"
            )

        # Check if asking about pricing/cost/packages
        pricing_prefix = ""
        if any(w in last_msg_lower for w in ["cost", "price", "pricing", "package", "packages", "rate", "rates", "budget"]):
            pricing_prefix = (
                "We offer 3 primary interior packages tailored to your budget:\n"
                "- **Standard** (₹1,000-₹1,500/sq.ft): Smart, high-quality finishes, perfect for modern apartments.\n"
                "- **Premium** (₹1,800-₹2,500/sq.ft): Custom modular woodwork, false ceilings, lighting, and full designer styling.\n"
                "- **Luxury** (₹3,500+/sq.ft): Elite Italian marbles, premium veneers, and automated systems.\n\n"
            )

        # Decide missing fields based on the checklist
        missing = [f for f in ["name", "location", "property_type", "design_style", "budget", "email", "phone"] if not fields.get(f)]

        is_complete = False
        if not missing:
            reply = "Thank you! I have gathered all the details. A senior designer from YAVI will contact you shortly."
            is_complete = True
        else:
            next_f = missing[0]
            if next_f == "name":
                reply = "Got it. May I know your name, please?"
            elif next_f == "location":
                reply = "Where are you located? (e.g., Chennai, Delhi, Mumbai)"
            elif next_f == "property_type":
                reply = "What type of property is this? (e.g., Apartment, Villa, Office)"
            elif next_f == "design_style":
                reply = "What design style do you prefer? (e.g., Modern, Contemporary, Minimalist)"
            elif next_f == "budget":
                reply = "What is your approximate budget for this project?"
            elif next_f == "email":
                if last_assistant_msg and "email address" in last_assistant_msg:
                    reply = "It seems that's not a valid email address. Could you please share a valid email address so we can contact you?"
                else:
                    reply = "Perfect. Could you please share your email address?"
            elif next_f == "phone":
                if last_assistant_msg and "phone number" in last_assistant_msg:
                    reply = "It seems that's not a valid phone number. Please share a valid 10-digit phone number so our designers can reach you."
                else:
                    reply = "Lastly, what is the best phone number to reach you?"
            else:
                reply = "Could you tell me a little more about your space?"

        # Combine prefixes and reply
        full_reply = ""
        if service_prefix:
            full_reply += service_prefix
        if pricing_prefix:
            full_reply += pricing_prefix

        if service_prefix or pricing_prefix:
            if not is_complete:
                full_reply += f"To help us quote accurately, {reply[0].lower()}{reply[1:]}"
            else:
                full_reply += reply
        else:
            full_reply = reply

        res = {
            "reply": full_reply,
            "fields": fields,
            "is_complete": is_complete
        }
        return json.dumps(res)


class OpenAIProvider(AIProvider):
    def __init__(self):
        import openai
        import os
        self.api_key = os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            raise RuntimeError("OPENAI_API_KEY is not set in the environment")
        self.client = openai.OpenAI(api_key=self.api_key)
        self.model = settings.ai_model if "gpt" in settings.ai_model else "gpt-4o-mini"

    def complete(self, system: str, messages: list[dict], max_tokens: int = 800) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": system}] + messages,
            max_tokens=max_tokens,
            temperature=0.2,
        )
        return response.choices[0].message.content


_PROVIDERS = {
    "anthropic": AnthropicProvider,
    "openai": OpenAIProvider,
}


def get_ai_provider() -> AIProvider:
    import os
    key = os.environ.get("OPENAI_API_KEY") or ""
    if settings.ai_provider == "openai" and (not key or "your-real-key" in key or "your-" in key):
        return MockOpenAIProvider()
    if settings.ai_provider == "anthropic" and not settings.anthropic_api_key:
        return EchoProvider()
    provider_cls = _PROVIDERS.get(settings.ai_provider)
    if not provider_cls:
        return EchoProvider()
    return provider_cls()

