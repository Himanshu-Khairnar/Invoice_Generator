export const   signUp = async  ({fullname,email, password}: {fullname: string, email: string, password: string}) => {
    try {
        const res= await fetch('/api/auth/register',{
            method:'POST',
            headers:{   
                'Content-Type':'application/json'
            },
            body:JSON.stringify({fullname,email,password})});
        if(!res.ok){
            throw new Error('Failed to register user');
        }
        const data= await res.json();
        return data;
    } catch (error) {
        console.error(error);
        
    }
}
export const login = async  ({email, password}: {email: string, password: string}) => {
    try {
        const res= await fetch('/api/auth/login',{
            method:'POST',
            headers:{   
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})});
        if(!res.ok){
            throw new Error('Failed to login user');
        }
        const data= await res.json();
        return data;
    } catch (error) {
        console.error(error);
        
    }
}