import { createRoot } from "react-dom/client";
import {
  BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY,
  BACKGROUND_IMAGE_SIZE_STORAGE_KEY,
  BACKGROUND_IMAGE_URL_STORAGE_KEY,
  IS_SEARCH_TEXT_CHECKED_STORAGE_KEY,
} from "@/entrypoints/utils/storage";
import { PopUpCursor } from "./component/cursor/PopUpCursor";

const CHAT_BACKGROUND_CLASS_ID = "[data-asset-chat-background-dark]";
const CHAT_BACKGROUND_CLASS_ID_2 = "_aigv";
const POP_UP_CURSOR_ID = "pop-up-cursor";
const POP_UP_CURSOR_BUTTON_ID = "pop-up-cursor-button";

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
    chatBackground.style.opacity = brightness ?? "1";
  }
};

const changeChatBackgroundSize = async (size: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID);
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.backgroundSize = size ? `${size}%` : "100%";
  }
};

const handleChatBackgroundChange = async () => {
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
};

const handleSelection = async () => {
  let isSearchTextChecked = (await storage.getItem(
    IS_SEARCH_TEXT_CHECKED_STORAGE_KEY
  )) as unknown as boolean | null;

  storage.watch<boolean>(IS_SEARCH_TEXT_CHECKED_STORAGE_KEY, (newValue) => {
    isSearchTextChecked = newValue;
  });

  const handleMouseUp = async () => {
    const selection = window.getSelection();
    const currentPopUpCursor = document.getElementById(POP_UP_CURSOR_ID);

    if (
      !isSearchTextChecked ||
      !selection ||
      !selection.rangeCount ||
      selection.toString().length === 0 ||
      currentPopUpCursor
    ) {
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();

    const popUpCursor = document.createElement("div");
    popUpCursor.id = POP_UP_CURSOR_ID;
    document.body.appendChild(popUpCursor);

    const root = createRoot(document.getElementById(POP_UP_CURSOR_ID)!);
    root.render(
      <PopUpCursor
        top={rect.bottom + window.scrollY}
        left={rect.right + window.scrollX}
        text={selection.toString()}
      />
    );
  };

  const handleMouseDown = (event: MouseEvent) => {
    const selection = window.getSelection();
    if (
      event.target instanceof HTMLElement &&
      !event.target.id.includes(POP_UP_CURSOR_BUTTON_ID) &&
      selection &&
      selection.toString().length === 0
    ) {
      const currentPopUpCursor = document.getElementById(POP_UP_CURSOR_ID);
      if (currentPopUpCursor) {
        document.body.removeChild(currentPopUpCursor);
      }
    }
  };

  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);

  return () => {
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mouseup", handleMouseUp);
  };
};

export default defineContentScript({
  matches: ["*://web.whatsapp.com//*"],
  runAt: "document_end",
  async main() {
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

    handleChatBackgroundChange();

    handleSelection();
  },
});
