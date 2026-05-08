import { User, UserService } from "./UserService";

describe('UserService', () => {
    let mockDb: User[]
    let userService: UserService

    beforeEach(() => {
        mockDb = [
            { name: 'Joana', email: 'joana@dio.com' },
            { name: 'Nath', email: 'nath@test.com' }
        ]
        userService = new UserService(mockDb)
    })

    describe('createUser', () => {
        it('Deve adicionar um novo usuário', () => {
            const mockConsole = jest.spyOn(global.console, 'log')
            userService.createUser('Maria', 'maria@test.com')
            
            expect(mockConsole).toHaveBeenCalledWith('DB atualizado', expect.any(Array))
            expect(userService.getAllUsers()).toHaveLength(3)
            expect(userService.getAllUsers()).toContainEqual({ name: 'Maria', email: 'maria@test.com' })
        })
    })

    describe('getAllUsers', () => {
        it('Deve retornar todos os usuários', () => {
            const users = userService.getAllUsers()
            
            expect(users).toHaveLength(2)
            expect(users).toContainEqual({ name: 'Joana', email: 'joana@dio.com' })
            expect(users).toContainEqual({ name: 'Nath', email: 'nath@test.com' })
        })

        it('Deve retornar uma lista vazia quando não há usuários', () => {
            const emptyUserService = new UserService([])
            const users = emptyUserService.getAllUsers()
            
            expect(users).toEqual([])
            expect(users).toHaveLength(0)
        })
    })

    describe('deleteUser', () => {
        it('Deve deletar um usuário existente', () => {
            const isDeleted = userService.deleteUser('Nath')
            
            expect(isDeleted).toBe(true)
            expect(userService.getAllUsers()).toHaveLength(1)
            expect(userService.getAllUsers()).not.toContainEqual({ name: 'Nath', email: 'nath@test.com' })
            expect(userService.getAllUsers()).toContainEqual({ name: 'Joana', email: 'joana@dio.com' })
        })

        it('Deve retornar false quando usuário não existe', () => {
            const isDeleted = userService.deleteUser('UsuarioInexistente')
            
            expect(isDeleted).toBe(false)
            expect(userService.getAllUsers()).toHaveLength(2)
        })

        it('Deve deletar o usuário correto quando há múltiplos com nomes semelhantes', () => {
            const userServiceWithDuplicates = new UserService([
                { name: 'Nath', email: 'nath1@test.com' },
                { name: 'Nathan', email: 'nathan@test.com' },
                { name: 'Nath', email: 'nath2@test.com' }
            ])
            
            const isDeleted = userServiceWithDuplicates.deleteUser('Nath')
            
            expect(isDeleted).toBe(true)
            expect(userServiceWithDuplicates.getAllUsers()).toHaveLength(1)
            expect(userServiceWithDuplicates.getAllUsers()).toContainEqual({ name: 'Nathan', email: 'nathan@test.com' })
        })
    })
})
