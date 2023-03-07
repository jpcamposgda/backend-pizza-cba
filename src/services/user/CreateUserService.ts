import prismaClient from '../../prisma'

import { hash } from 'bcryptjs';

interface UserRequest {

    name: string;
    email: string;
    password: string;

}

class CreateUserService {

    async execute({ name, email, password }: UserRequest) {

        if (!email) {

            throw new Error('email incorrect');

        }

        const passwordHash = await hash(password, 8);

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (userAlreadyExists) {

            throw new Error('email already exists')

        }

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash

            },

            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return user;
    }
}

export { CreateUserService }