// data.ts
export interface ImageData {
  id: number;
  url: string;
}

export const imageData: ImageData[] = [];
for (let i = 1; i < 70; i++) {
  imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
}
