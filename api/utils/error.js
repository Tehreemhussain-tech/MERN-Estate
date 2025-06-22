export const errorHandler = (statusCode, message)=>{
    
    //create error constructor to create a new error.
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    return error;
}