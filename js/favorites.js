export class GithubUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`
        return fetch(endpoint)
                .then(data => data.json())
                .then(({login, name, followers, public_repos}) => ({login, name, followers, public_repos})) 
    }
}

export class Favorites{ 
    constructor(root){ 
        this.root = document.querySelector(root)
        this.load()

       
    }

    load(){
        this.entries= JSON.parse(localStorage.getItem('@Gitfav-favorites:'))|| []
    }

    delete(user){
        const filterUserDel = this.entries.filter(entry => entry.login !== user.login)
        this.entries = filterUserDel
        this.update()
    }

    async add(username){
        try{
            const user = await GithubUser.search(username)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
        }catch(error){
            alert(error.message)
        }
    }
}    

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody') 
        
        this.update()
        this.onadd()
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/wagnercsn.png" alt="Imagem de Wagner">
                <a href="https://github.com/wagnercsn">
                    <p>Wagner Costa</p>
                    <span>wagnercsn</span>
                </a>
            </td>
            <td class="follower">
                31
            </td>
            <td class="repository">
                15
            </td>
            <td>
                <button class="remov">Remover</button>
            </td>
            `
        return tr
    }

    removeAllLine(){
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => tr.remove())
    }

    update(){
        this.removeAllLine()
        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de/${user.name}`
            row.querySelector('.user a p').textContent = `${user.name}`
            row.querySelector('.user a span').textContent = `${user.login}`
            row.querySelector('.follower').textContent = `${user.followers}`
            row.querySelector('.repository').textContent = `${user.public_repos}`
            row.querySelector('.remov').onclick = () => {
                const isOk = confirm(`Tem certeza que quer apagar ${user.login}?`)
                if(isOk){
                    this.delete(user)
                }
            }
           
            this.tbody.append(row)
        })
    }

    onadd(){
        const buttonFavorite = this.root.querySelector('header .favoritar') 
        buttonFavorite.onclick = () =>{
            const {value} = this.root.querySelector('#input-favoritar')

            this.add(value)
        }
        
    }

}




