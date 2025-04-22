export class ImageBase64Data {
  public imageType!: string;
  public base64Content!: string;

  constructor(obj: Partial<ImageBase64Data>) {
    Object.assign(this, { ...obj });
  }

  public toBase64String(): string {
    return `data:${this.imageType};base64,${this.base64Content}`;
  }

  public static fromBase64String(str: string): ImageBase64Data | undefined {
    const matches = str.match(/data:(.+);base64,([\s\S]+)/);
    if (matches && matches.length === 3) {
      const data = {
        imageType: matches[1],
        base64Content: matches[2],
      };
      return new ImageBase64Data(data);
    }

    return undefined;
  }
}

export type Base64Data = string;
