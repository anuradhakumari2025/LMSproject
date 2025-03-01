const {Webhook} = require('svix')
const User = require('../models/User')
const Stripe  = require('stripe')

//API Controller function to Manage Clerk User with db
module.exports.clerkWebhooks = async(req,res)=>{
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    await whook.verify(JSON.stringify(req.body),{
      'svix-id':req.headers['svix-id'],
      'svix-timestamp':req.headers['svix-timestamp'],
      'svix-signature':req.headers['svix-signature']

    })

    const {data,type} =  req.body
    switch(type){
      case 'user.created':{
        const userData = {
          _id:data.id,
          email:data.email_addresses[0].email_address,
          name:data.first_name +" " +data.second_name,
          imageUrl:data.image_url,
        }
        await User.create(userData)
        res.JSON({})
        break;
      }
      case 'user.updated':{
        const userData = {
          email:data.email_address[0].email_address,
          name:data.first_name +" " +data.second_name,
          imageUrl:data.image_url,
        }
        await User.findByIdAndUpdate(data.id,userData)
        res.JSON({})
        break;
      }

      case 'user.deleted':{
        await User.findByIdAndDelete(data.id)
        res.JSON({})
        break;
      }
        
      default:
        break;
    }
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports.stripeWebhooks = async(req,res)=>{
  const sig = request.headers['stripe-signature']
  let event;
  try {
    event = Stripe.Webhook.construct_event(
      request.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.log(error)
    res.status(400).send(`Webhook Error: ${error.message}`)
  }

}