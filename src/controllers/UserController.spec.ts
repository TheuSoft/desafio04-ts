import { UserController } from "./UserController";
import { UserService } from '../services/UserService'
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

describe('UserController', () => {
    let mockUserService: Partial<UserService>
    let userController: UserController

    beforeEach(() => {
        mockUserService = {
            createUser: jest.fn(),
            getAllUsers: jest.fn(),
            deleteUser: jest.fn()
        }
        userController = new UserController(mockUserService as UserService)
    })

    describe('createUser', () => {
        it('Deve adicionar um novo usuário com sucesso', () => {
            const mockRequest = {
                body: {
                    name: 'Nath',
                    email: 'nath@test.com'
                }
            } as Request
            const mockResponse = makeMockResponse()
            userController.createUser(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(201)
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado' })
            expect(mockUserService.createUser).toHaveBeenCalledWith('Nath', 'nath@test.com')
        })

        it('Deve retornar erro 400 quando name não é informado', () => {
            const mockRequest = {
                body: {
                    email: 'nath@test.com'
                }
            } as Request
            const mockResponse = makeMockResponse()
            userController.createUser(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(400)
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name obrigatório' })
        })

        it('Deve retornar erro 400 quando email não é informado', () => {
            const mockRequest = {
                body: {
                    name: 'Nath'
                }
            } as Request
            const mockResponse = makeMockResponse()
            userController.createUser(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(400)
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Email obrigatório' })
        })
    })

    describe('getAllUsers', () => {
        it('Deve retornar a lista de todos os usuários', () => {
            const mockUsers = [
                { name: 'Joana', email: 'joana@dio.com' },
                { name: 'Nath', email: 'nath@test.com' }
            ]
            ;(mockUserService.getAllUsers as jest.Mock).mockReturnValue(mockUsers)
            
            const mockRequest = {} as Request
            const mockResponse = makeMockResponse()
            userController.getAllUsers(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(200)
            expect(mockResponse.state.json).toEqual(mockUsers)
            expect(mockUserService.getAllUsers).toHaveBeenCalled()
        })

        it('Deve retornar uma lista vazia quando não há usuários', () => {
            ;(mockUserService.getAllUsers as jest.Mock).mockReturnValue([])
            
            const mockRequest = {} as Request
            const mockResponse = makeMockResponse()
            userController.getAllUsers(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(200)
            expect(mockResponse.state.json).toEqual([])
        })
    })

    describe('deleteUser', () => {
        it('Deve deletar um usuário com sucesso', () => {
            ;(mockUserService.deleteUser as jest.Mock).mockReturnValue(true)
            
            const mockRequest = {
                body: {
                    name: 'Nath'
                }
            } as Request
            const mockResponse = makeMockResponse()
            userController.deleteUser(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(200)
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário deletado' })
            expect(mockUserService.deleteUser).toHaveBeenCalledWith('Nath')
        })

        it('Deve retornar erro 400 quando name não é informado no delete', () => {
            const mockRequest = {
                body: {}
            } as Request
            const mockResponse = makeMockResponse()
            userController.deleteUser(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(400)
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name obrigatório' })
        })

        it('Deve retornar erro 404 quando usuário não é encontrado', () => {
            ;(mockUserService.deleteUser as jest.Mock).mockReturnValue(false)
            
            const mockRequest = {
                body: {
                    name: 'UsuarioInexistente'
                }
            } as Request
            const mockResponse = makeMockResponse()
            userController.deleteUser(mockRequest, mockResponse)
            
            expect(mockResponse.state.status).toBe(404)
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' })
        })
    })
})
