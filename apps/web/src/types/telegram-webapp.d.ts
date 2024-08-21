declare global {
  interface Window {
    Telegram?: TelegramWebApp
  }
}

interface TelegramWebApp {
  WebApp: {
    ready: () => void
    close: () => void
    expand: () => void
    isExpanded: boolean
    setHeaderColor: (color: string) => void
    setBackgroundColor: (color: string) => void
    enableClosingConfirmation: () => void
    disableClosingConfirmation: () => void
    isClosingConfirmationEnabled: boolean
    onEvent: (eventType: string, eventHandler: () => void) => void
    offEvent: (eventType: string, eventHandler: () => void) => void
    sendData: (data: string) => void
    switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
    openLink: (url: string, options?: { try_instant_view: boolean }) => void
    openTelegramLink: (url: string) => void
    openInvoice: (url: string, callback?: (status: string) => void) => void
    showPopup: (params: PopupParams, callback?: (id: string) => void) => void
    showAlert: (message: string, callback?: () => void) => void
    showConfirm: (
      message: string,
      callback?: (isConfirmed: boolean) => void
    ) => void
    showScanQrPopup: (
      params: QrPopupParams,
      callback?: (text: string) => void
    ) => void
    closeScanQrPopup: () => void
    readTextFromClipboard: (callback?: (text: string) => void) => void
    requestWriteAccess: (callback?: (isGranted: boolean) => void) => void
    requestContact: (callback?: (isShared: boolean) => void) => void
    HapticFeedback: {
      impactOccurred: (
        style: "light" | "medium" | "heavy" | "rigid" | "soft"
      ) => void
      notificationOccurred: (type: "error" | "success" | "warning") => void
      selectionChanged: () => void
    }
    isVersionAtLeast: (version: string) => boolean
    setBackButtonVisible: (visible: boolean) => void
    BackButton: {
      isVisible: boolean
      onClick: (callback: () => void) => void
      offClick: (callback: () => void) => void
      show: (callback?: () => void) => void
      hide: (callback?: () => void) => void
    }
    MainButton: {
      text: string
      color: string
      textColor: string
      isVisible: boolean
      isActive: boolean
      isProgressVisible: boolean
      setText: (text: string) => void
      onClick: (callback: () => void) => void
      offClick: (callback: () => void) => void
      show: () => void
      hide: () => void
      enable: () => void
      disable: () => void
      showProgress: (leaveActive: boolean) => void
      hideProgress: () => void
      setParams: (params: MainButtonParams) => void
    }
    SettingsButton: {
      isVisible: boolean
      onClick: (callback: () => void) => void
      offClick: (callback: () => void) => void
      show: () => void
      hide: () => void
    }
    CloudStorage: {
      setItem: (
        key: string,
        value: string,
        callback?: (error: Error | null, saved: boolean) => void
      ) => void
      getItem: (
        key: string,
        callback?: (error: Error | null, value: string | null) => void
      ) => void
      getItems: (
        keys: string[],
        callback?: (error: Error | null, values: (string | null)[]) => void
      ) => void
      removeItem: (
        key: string,
        callback?: (error: Error | null) => void
      ) => void
      removeItems: (
        keys: string[],
        callback?: (error: Error | null) => void
      ) => void
      getKeys: (
        callback?: (error: Error | null, keys: string[]) => void
      ) => void
    }
    headerColor: string
    backgroundColor: string
    isClosingConfirmationEnabled: boolean
    initData: string
    initDataUnsafe: WebAppInitData
    version: string
    colorScheme: "light" | "dark"
    themeParams: ThemeParams
    isExpanded: boolean
    viewportHeight: number
    viewportStableHeight: number
    platform: string
  }
}

interface PopupParams {
  title?: string
  message: string
  buttons?: PopupButton[]
}

interface PopupButton {
  id?: string
  type?: "default" | "ok" | "close" | "cancel" | "destructive"
  text?: string
}

interface QrPopupParams {
  text?: string
  callback?: (text: string) => void
}

interface MainButtonParams {
  text?: string
  color?: string
  text_color?: string
  is_active?: boolean
  is_visible?: boolean
}

interface WebAppInitData {
  query_id?: string
  user?: WebAppUser
  receiver?: WebAppUser
  chat?: WebAppChat
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
}

interface WebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

interface WebAppChat {
  id: number
  type: "group" | "supergroup" | "channel"
  title: string
  username?: string
  photo_url?: string
}

interface ThemeParams {
  accent_text_color: string
  bg_color: string
  button_color: string
  button_text_color: string
  destructive_text_color: string
  header_bg_color: string
  hint_color: string
  link_color: string
  secondary_bg_color: string
  section_bg_color: string
  section_header_text_color: string
  subtitle_text_color: string
  text_color: string
}

export type { TelegramWebApp }
