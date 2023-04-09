import {GithubUser} from "./githubusers.js"

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
        this.save()
        this.NoFavorites()
    }

    save(){
        localStorage.setItem('@Gitfav-favorites:', JSON.stringify(this.entries))
    }

    async add(username){
        try{
           
            const registeredUser = this.entries.find(entry => entry.login.toLowerCase() === username)
            this.NoFavorites()
            if (registeredUser){
                throw new Error('Usuário já Favoritado')
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
           
            this.update()
            this.save()
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
        this.hover()
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="" alt="Imagem de Wagner">
                <a href="">
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
            row.querySelector('.user a').href = `https://github.com/${user.login}`
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
            this.NoFavorites()
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

    hover(){
        const estrela = this.root.querySelector(".favoritar .estrela")
        const estrela2 = this.root.querySelector(".favoritar .estrela2")
        const button = this.root.querySelector("header .favoritar")
        button.addEventListener('mouseover', function (){
            estrela.classList.add('hide')
            estrela2.classList.remove('hide')
        })

        button.addEventListener('mouseout', function (){
            estrela2.classList.add('hide')
            estrela.classList.remove('hide')
        })
    }

    NoFavorites(){
        const noregister = this.root.querySelector('.noFiv')
        const noRegisteredUser = this.entries.filter(entry =>entry)
        
    
        if(noRegisteredUser.length===0){
            noregister.classList.remove('hide');
        }else{
            noregister.classList.add('hide');
        }
    }
}