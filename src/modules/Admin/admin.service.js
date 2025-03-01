import { asyncHandeler } from "../../utils/error/index.js";
import UserModel from "../../DB/models/User.model.js"
import { RoleTypes } from "../../utils/enumTypes.js";
import CompanyModel from "../../DB/models/Company.model.js";

export const banUser = asyncHandeler(async(req,res,next )=>{
    const {userId} =req.params
    const {action} = req.body
    const user = await UserModel.findOne({_id:userId , role :RoleTypes.USER })
    if(!user) return next(new Error("sorry this user not found or user is Admin or user is bann", { cause: 400 }));
    
    let actionTake
    if (action=="bannuser"){
        actionTake=  await UserModel.findByIdAndUpdate(userId , {bannedAt : Date.now()},{new:true})
    }else if(action == "unbanuser"){
        actionTake=  await UserModel.findByIdAndUpdate(userId,{$unset:{bannedAt:0}},{new:true})
    }else
    return next(new Error("sorry i can't under tand your action", { cause: 400 }));
    return  res.status(200).json({msg:"done",actionTake})    
})

// ----------------------- Ban or Unban Company --------------------------------------
export const banCompany = asyncHandeler(async(req,res,next )=>{
    const {companyId} =req.params
    const {action} = req.body
    const user = await CompanyModel.findOne({_id :companyId } )
    if(!user) return next(new Error("sorry company not found or bann", { cause: 400 }));
    
    let actionTake
    if (action=="banncompany"){
        actionTake=  await CompanyModel.findByIdAndUpdate(companyId , {bannedAt : Date.now()},{new:true})
    }else if(action == "unbanncompany"){
        actionTake=  await CompanyModel.findByIdAndUpdate(companyId,{$unset:{bannedAt:0}},{new:true})
    }else
    return next(new Error("sorry i can't under tand your action", { cause: 400 }));
    // then we should put the achive by bannedAt action in any Apis in job or company
    return  res.status(200).json({msg:"done",actionTake})    
})


// ----------------------- Approve company --------------------------------------
export const Approvecompany  = asyncHandeler(async(req,res,next )=>{
    const {companyId} =req.params
    const {Action } = req.query
   
    const user = await CompanyModel.findOne({_id :companyId ,  bannedAt:{$exists : false} , FreazeCompany :false} )
    if(!user) return next(new Error("sorry company not found or bann or company deleted", { cause: 400 }));
    let AppOrUnApp
    let NameAction
    if (Action == "approve") {
     AppOrUnApp= await CompanyModel.findByIdAndUpdate(companyId, {approvedByAdmin :true} ,{new : true})
     NameAction ="approve"
    }else if(Action === "unapprove"){
     AppOrUnApp= await CompanyModel.findByIdAndUpdate(companyId, {approvedByAdmin :false} ,{new : true})
     NameAction = "unapprove"
    }
    // then we should put the achive by approvedByAdmin action in any Apis in job or company
    return  res.status(200).json({msg:NameAction,AppOrUnApp})    
})