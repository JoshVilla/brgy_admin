import LostFound from "../../models/lostandfound";
import { connectToDatabase } from "@/lib/mongodb";
import { uploadImageToCloudinary } from "@/utils/asyncHelpers";

export async function AddLostAndFound(formData: FormData) {
    try {
        await connectToDatabase();
        
        const item = formData.get('item') as string
        const type = formData.get('type') as string
        const description = formData.get('description') as string
        const image1 = formData.get('image1') as File
        const image2 = formData.get('image2') as File
        const image3 = formData.get('image3') as File
        const dateFound = formData.get('dateFound') as string
        const status = formData.get('status') as string

        //validate fields
        if(!item || !type || !description || !dateFound || !status || !image1) {
            return {
                message: "Missing required fields item, type, description, dateFound, status, image1",
                isSuccess: false
            }
        }

        const imagesObj:any = {}

        let uploadedImage1: string | null = null;
        let uploadedImage2: string | null = null;
        let uploadedImage3: string | null = null;

        if(image1){
            uploadedImage1 = await uploadImageToCloudinary(image1);
            imagesObj.image1 = uploadedImage1;
        } else if(image2){
            uploadedImage2 = await uploadImageToCloudinary(image2);
            imagesObj.image2 = uploadedImage2;
        } else if(image3){
            uploadedImage3 = await uploadImageToCloudinary(image3);
            imagesObj.image3 = uploadedImage3;
        }

        const newLostAndFound = await LostFound.create({
            item,
            type,
            description,
            dateFound,
            status,
            ...imagesObj,
        })

        return {
            message: "Lost and found added successfully",
            isSuccess: true,
            data: newLostAndFound,
        }

    } catch (error:any) {
        return {
            message: "Failed to add lost and found",
            isSuccess: false,
            error: error.message,
        }
    }
}