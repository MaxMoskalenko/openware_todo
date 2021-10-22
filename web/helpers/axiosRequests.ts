import { instance as axios } from './axios'
import { useRouter, NextRouter } from 'next/dist/client/router'

export const postSignup = (email: string, password: string, router: NextRouter) => {
    axios().post(
        '/user/signup',
        { email: email, password: password }
    )
        .then((r: any) => {
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
            window.dispatchEvent(new Event('storage'))
            getLists(router);
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
            window.dispatchEvent(new Event('storage'))
        })
        .catch((e) => {
            if (e.response) {
                if (e.response.status == 401)
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
                if (e.response.status == 401)
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
                if (e.response.status == 401)
                    router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const putLists = (id: number, name: string, router: NextRouter) => {
    axios()
        .put(`/user/lists/${id}`, {
            name: name
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            },

        })
        .then((r: any) => {
            getLists(router)
        })
        .catch((e) => {
            if (e.response) {
                if (e.response.status == 401)
                    router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const getTasks = (list_id: number, router: NextRouter) => {
    axios()
        .get(`/user/lists/${list_id}/tasks`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            localStorage.setItem('tasksForCurrentList', JSON.stringify(r.data))
            window.dispatchEvent(new Event('storage'))
        })
        .catch((e) => {
            if (e.response) {
                if (e.response.status == 401)
                    router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const postTasks = (list_id: number, taskName: string, router: NextRouter) => {
    axios()
        .post(`/user/lists/${list_id}/tasks`, {
            'task_name': taskName,
            'description': '',
            'status': 'open'
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            getTasks(list_id, router)
        })
        .catch((e) => {
            if (e.response) {
                if (e.response.status == 401)
                    router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const deleteTasks = (list_id: number, task_id: number, router: NextRouter) => {
    axios()
        .delete(`/user/lists/${list_id}/tasks/${task_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        .then((r: any) => {
            getTasks(list_id, router)
        })
        .catch((e) => {
            if (e.response) {
                if (e.response.status == 401)
                    router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}

export const putTasks = (list_id: number, task_id: number, name: string, description: string, status: string, router: NextRouter) => {
    axios()
        .put(`/user/lists/${list_id}/tasks/${task_id}`, {
            'task_name': name,
            'description': description,
            'status': status

        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            },

        })
        .then((r: any) => {
            getTasks(list_id, router)
        })
        .catch((e) => {
            if (e.response) {
                if (e.response.status == 401)
                    router.push('/signin')
                alert(e.response.data)
            }
            else
                console.log(e);
        });
}
