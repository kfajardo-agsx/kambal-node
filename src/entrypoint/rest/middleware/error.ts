import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'express-validator'
import { log } from '../../../config'

const errorMap: Record<string, any> =  {
}

export interface ErrorInformationResponse {
}

export class APIError {
    constructor(
        public message: string
    ){
        this.message = this.message || 'ERROR'
    }
}

export const ErrorMiddleware = (err: Error, _: Request, res: Response, next: NextFunction) => {
    // validation errors
    if ((err as any).errors) {
        const validationErrs = ((err as any).errors as ValidationError[])
        const fields = validationErrs.map(e => { return { key: e.param, value: e.msg } })
        const response = {
            message: fields
        }
        res.status(400).json(response)
        return
    }

    // else map message to 
    let response = {
        message: err.message
    }

    const errResponse = errorMap[err.message]
    if (errResponse) {
        response.message = errResponse.message
    }
    log.error(response.message)
    res.status(500).json(response)
}