import { instance as axios } from './axios'
import { useRouter, NextRouter } from 'next/dist/client/router'

export const postSignup = (email: string, password: string, router: NextRouter) => {
    axios().post(
        '/user/signup',
        { email: email, password: password }
    )
        .then((r: any) => {
            // router.push('/signin')
            postSignin(email, password, router)
        })
        .catch((e: any) => {
            if (e.response)
                alert(e.response.data)
            else
                console.log(e);
        })
}


export const postSignin = (email: string, password: string, router: NextRouter) => {
    axios().post(
        '/user/signin',
        { email: email, password: password }
    )
        .then((r: any) => {
            //TODO do not use localStorage!!!
            localStorage.setItem('token', r.data);
            window.dispatchEvent( new Event('storage') )
            router.push('/lists');
        })
        .catch((e: any) => {
            if (e.response)
                alert(e.response.data)
            else
                console.log(e);
        })
}

export const getLists = (router: NextRouter) => {
    axios()
        .get('/user/lists', {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            localStorage.setItem('lists', JSON.stringify(r.data))
            window.dispatchEvent( new Event('storage') )
        })
        .catch((e) => {
            if (e.response) {
                router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const postLists = (listName: string, router: NextRouter) => {
    axios()
        .post('/user/lists', {
            name: listName
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            getLists(router)
        })
        .catch((e) => {
            if (e.response) {
                router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const deleteLists = (id: number, router: NextRouter) => {
    axios()
        .delete(`/user/lists/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            getLists(router)
        })
        .catch((e) => {
            if (e.response) {
                router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const putLists = (id: number, router: NextRouter) => {
    axios()
        .put(`/user/lists/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            getLists(router)
        })
        .catch((e) => {
            if (e.response) {
                router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

