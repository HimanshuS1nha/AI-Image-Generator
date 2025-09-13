export type MessageType =
  | {
      role: "user";
      content: string;
    }
  | {
      role: "ai";
      image: string;
      aspectRatio: string;
    };
