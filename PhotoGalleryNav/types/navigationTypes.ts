// types/navigationTypes.ts
import { ImageData } from "../data";  // Adjust the import path according to your structure

export type RootStackParamList = {
    Gallery: undefined;
    PhotoDetail: { image: ImageData };
    PhotoModal: { image: ImageData };
};
