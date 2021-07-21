import api from "./api-service"
import axios from 'axios'

class UserService {

    createUser(sub) {
        const data = {
            sub: sub,
        }
        const res = api.post("/users", data)
        return res
    }

    getUsers() {
        const res = api.get("/users")
        return res
    }

    uploadImage = async (sub, file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name);
        data.append('sub', sub)
        // POST request
        await axios.post('/upload', data, { 
          headers: { 'Content-Type': 'multipart/form-data', 'sub': sub}
        });
    }

    deleteImage(sub, name) {
        const data = {
            sub: sub,
            name: name
        }
        api.delete(`/users/images`, data)
    }

}

export default new UserService();