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

        # Check what we asked in the previous turn and extract the field
        if last_assistant_msg:
            last_msg_lower = last_user_msg.lower()
            if "name, please" in last_assistant_msg or "know your name" in last_assistant_msg:
                # Remove common intro phrases
                clean_name = re.sub(r'^(my name is|i am|this is|i\'m)\s+', '', last_msg_lower).strip().title()
                fields["name"] = clean_name
            elif "where are you located" in last_assistant_msg or "share your location" in last_assistant_msg:
                clean_loc = re.sub(r'^(i am in|i live in|located in|in|at)\s+', '', last_msg_lower).strip().title()
                fields["location"] = clean_loc
            elif "type of property" in last_assistant_msg:
                if "apartment" in last_msg_lower or "flat" in last_msg_lower:
                    fields["property_type"] = "Apartment"
                elif "villa" in last_msg_lower or "house" in last_msg_lower or "home" in last_msg_lower:
                    fields["property_type"] = "Villa"
                elif "office" in last_msg_lower or "studio" in last_msg_lower or "commercial" in last_msg_lower:
                    fields["property_type"] = "Office"
                else:
                    fields["property_type"] = last_user_msg.title()
            elif "design style" in last_assistant_msg:
                fields["design_style"] = last_user_msg.title()
            elif "approximate budget" in last_assistant_msg:
                fields["budget"] = last_user_msg
            elif "email address" in last_assistant_msg:
                email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', last_msg_lower)
                if email_match:
                    fields["email"] = email_match.group(0)
                else:
                    fields["email"] = last_user_msg
            elif "phone number" in last_assistant_msg:
                phone_match = re.search(r'\b\d{10}\b', last_msg_lower)
                if phone_match:
                    fields["phone"] = phone_match.group(0)
                else:
                    fields["phone"] = last_user_msg

        # Fallback keyword matching just in case they mention things out of order
        last_msg_lower = last_user_msg.lower()
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
                reply = "Perfect. Could you please share your email address?"
            elif next_f == "phone":
                reply = "Lastly, what is the best phone number to reach you?"
            else:
                reply = "Could you tell me a little more about your space?"

        res = {
            "reply": reply,
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

