import { Client, Account , ID } from "appwrite";



export class AuthService {
    Client = new Client()
    account;

    constructor() {
        this.Client
          .setEndpoint('conf.appwriteUrl')
          .setProject('conf.appwriteProjectId');
        
        this.account = new Account(this.Client);


    }
    async createAccount({fullname, username, email, password}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, fullname, username);
            if (userAccount){
                return this.login({username, password})
            }
            else{
                return userAccount;
            }
        } catch (error) {
            console.log(error);
        }
    }
    async login({username, password}) {
        try {
         await this.account.createEmailSession(username, password);
            
        } catch (error) {
            console.log(error);
        }
    }
    async getCurrentUser(){
        try{
            return await this.account.get();
        }
        catch(error){
            console.log(error);
        }
        return null;
    }
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log(error);
        }
    } 
}

const authService = new AuthService();



export default AuthService();