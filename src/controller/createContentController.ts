import type { Request, Response } from "express";
import z from "zod";
import { Content } from "../model/ContentModel.js";
import { Tag } from "../model/TagModel.js";


export const createContentController=async (req:Request,res:Response)=>{
    try {
        const requestBody = z.object({
            link:z.string(),
            title:z.string().min(3).max(50),
            type:z.string(),
            tags:z.array(z.string())
        })
        const {success, error} = requestBody.safeParse(req.body);
        if(!success) return res.status(411).json({            
            message:"Something went wrong can't create the course",
            error:error.format()
        })
        console.log("success");
        
        const {link,type,title,tags} =req.body;
        const userId= req.user._id;

        // Resolve tags: find existing ones or create new ones
        const tagPromises = tags.map((tagTitle: string) => 
            Tag.findOneAndUpdate(
                { title: tagTitle }, 
                { title: tagTitle }, 
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
        );
        const resolvedTags = await Promise.all(tagPromises);
        const tagIds = resolvedTags.map(tag => tag._id);

       await Content.create({
            link, type, title , tags: tagIds, userId
        })
        res.status(201).json({
            message:"Content created successfully"
        })
    } catch (err) {
      console.log(err);
        return res.status(500).json({message:"Something went wrong can't create the course", error:err})
    }

}