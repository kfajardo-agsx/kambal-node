import { Repository } from '../repository/interfaces';
import { Service } from "./interfaces";
import { CreateRequest,  UpdateRequest, DeleteRequest, LoginRequest } from "./models";
import { UserInput, UserReturn } from '../repository/models';
// import { log } from '../../config'
import { APIError } from '../../entrypoint/rest/middleware/error';
import { encrypt } from '../util/tools';

export class UserService implements Service {

  constructor(
    private repository: Repository
  ){}

  async create(request: CreateRequest): Promise<string> {
    const encryptedPassword = encrypt(request.password)
    const user: UserInput = {
      username: request.username,
      encryptedPassword: encryptedPassword,
      userRole: request.userRole || 'customer',
      customerId: request.customerId || ''
    }
    return await this.repository.createUser(user);
  }
  async update(request: UpdateRequest): Promise<void | APIError> {
    const encryptedPassword = encrypt(request.oldPassword)
    const response = await this.repository.getUser(request.username, encryptedPassword)
    if (response == null) {
      throw new APIError('Old password is incorrect')
    }
    await this.repository.updatePassword(request.username, encrypt(request.newPassword))
  }
  
  
  async login(request: LoginRequest): Promise<UserReturn> {
    const encryptedPassword = encrypt(request.password)
    const response = await this.repository.getUser(request.username, encryptedPassword)
    if (response != null) {
      return {
        id: response.id,
        username: response.username,
        userRole: response.userRole,
        customerId: response.customerId
      }
    }
    throw new APIError('Username/Password is incorrect.')
  }

  


  // async create(request: CreateRequest): Promise<UserReturn | APIError> {
  //   const partyInput = {
  //     partyIdType: request.partyIdType,
  //     partyIdentifier: request.partyIdentifier,
  //     partySubIdOrType: request.partySubIdOrType,
  //     currency: request.currency
  //   }

  //   // check if entry should be updated instead
  //   const existsParty = await this.repository.partyExists(partyInput);
  //   if (existsParty != null) {
  //     return new APIError('3003', 'PARTY_ALREADY_EXISTS', request)
  //   }
  
  //   // create the party
  //   const fsp: Participant = await this.repository.getOrCreateParticipant(request.fspId);
  //   await this.repository.createParty(partyInput, fsp);
    
  //   return {
  //     fspId: request.fspId,
  //     currency: request.currency,
  //     partySubIdOrType: request.partySubIdOrType
  //   }
  // }

  // async get(request: GetRequest): Promise<GetResponse> {
  //   // get the party information
  //   const partyReturn = await this.repository.getParty(request.partyIdType, request.partyIdentifier, request.partySubIdOrType || '', request.currency || '')
  //   // setup response
  //   const response: GetResponse = {
  //     partyList: partyReturn
  //   }

  //   log.debug(JSON.stringify(partyReturn, null, 4))
  //   return response
  // }

  // async update(request: UpdateRequest): Promise<void | APIError> {
  //   // get the party first
  //   const existsParty = await this.repository.partyExists({
  //     partyIdType: request.partyIdType,
  //     partyIdentifier: request.partyIdentifier,
  //     partySubIdOrType: request.partySubIdOrType,
  //     currency: request.currency
  //   });
  //   if (existsParty == null) {
  //      return new APIError('3204', 'PARTY_NOT_FOUND', request)
  //   }
    
  //   // update the party
  //   const fsp: Participant = await this.repository.getOrCreateParticipant(request.fspId);
  //   await this.repository.updateParty(existsParty, fsp);
  // }

  // async delete(request: DeleteRequest): Promise<void | APIError> {
  //   const partyInput = {
  //     partyIdType: request.partyIdType,
  //     partyIdentifier: request.partyIdentifier,
  //     partySubIdOrType: request.partySubIdOrType as string,
  //     currency: request.currency
  //   }
  //   // get the party first
  //   const existsParty = await this.repository.partyExists(partyInput);
  //   if (existsParty == null) {
  //      return new APIError('3204', 'PARTY_NOT_FOUND', request)
  //   }
  //   await this.repository.deleteParty(partyInput)
  // }
}