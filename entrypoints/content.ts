import {
  BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY,
  BACKGROUND_IMAGE_SIZE_STORAGE_KEY,
  BACKGROUND_IMAGE_URL_STORAGE_KEY,
} from "@/entrypoints/utils/storage";
const CHAT_BACKGROUND_CLASS_ID = "[data-asset-chat-background-dark]";
const CHAT_BACKGROUND_CLASS_ID_2 = "_aigv";

const changeChatBackground = async (imageUrl: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID);
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.backgroundImage = `url(${imageUrl})`;
    chatBackground.style.backgroundPosition = "center";
    chatBackground.style.backgroundRepeat = "no-repeat";
  }
};

const changeChatBackgroundBrightness = async (brightness: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID);
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.opacity = brightness || "1";
  }
};

const changeChatBackgroundSize = async (size: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID);
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.backgroundSize = `${size}%` || "100%";
  }
};

export default defineContentScript({
  matches: ["*://web.whatsapp.com//*"],
  runAt: "document_end",
  main() {
    storage.watch<string>(BACKGROUND_IMAGE_URL_STORAGE_KEY, (newValue) => {
      changeChatBackground(newValue);
    });

    storage.watch<string>(
      BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY,
      (newValue) => {
        changeChatBackgroundBrightness(newValue);
      }
    );

    storage.watch<string>(BACKGROUND_IMAGE_SIZE_STORAGE_KEY, (newValue) => {
      changeChatBackgroundSize(newValue);
    });

    const observer = new MutationObserver(async (mutations) => {
      const isChatBackgroundChanged = mutations.some((mutation) => {
        const targetElement = mutation.target as HTMLElement;
        return targetElement.classList.contains(CHAT_BACKGROUND_CLASS_ID_2);
      });

      const imageUrl = (await storage.getItem(
        BACKGROUND_IMAGE_URL_STORAGE_KEY
      )) as unknown as string | null;

      if (isChatBackgroundChanged && imageUrl) {
        const imageBrightness = (await storage.getItem(
          BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY
        )) as unknown as string | null;

        const imageSize = (await storage.getItem(
          BACKGROUND_IMAGE_SIZE_STORAGE_KEY
        )) as unknown as string | null;

        changeChatBackground(imageUrl);
        changeChatBackgroundBrightness(imageBrightness);
        changeChatBackgroundSize(imageSize);

        observer.disconnect();

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
