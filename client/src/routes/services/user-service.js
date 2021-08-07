import axios from 'axios'

class UserService {

    createUser(sub, identificationToken) {
        const data = {
            sub: sub,
            token: identificationToken
        }
        const res = axios.post("/users", data)
        return res
    }

    uploadImage = async (sub, user, file, identificationToken) => {
        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name);
        data.append('sub', sub)
        // POST request
        const res = await axios.post('/upload', data, { 
          headers: { 'Content-Type': 'multipart/form-data', 'sub': sub, 'user': user, 'token': identificationToken}
        });
		
		return res
    }

}

export default new UserService();