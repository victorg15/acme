import { PrismaClient, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Console, error } from 'console';
import { console } from 'inspector';

const prisma = new PrismaClient();

async function main(){
    console.log('Iniciando população de banco de dados...');

    const password = await bcrypt.hash('password', 10);

    const user = prisma.user.upsert({
        where: { email: 'admin@acme.com'},
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@acme.com',
            password: password
        } 
    });

    console.log ('Usuário criado com sucesso.');

    const customer_data = [{
        name: 'Alex Bessa',
        email: 'alex@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Alex+Bessa&background=random'
    }, {
        name: 'Valdiana Bessa',
        email: 'alex@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Valdiana+Bessa&background=random'
    }, {
        name: 'Timóteo Bessa',
        email: 'alex@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Timóteo+Bessa&background=random'
    }];

    const customers = [];

    for(const data of customer_data) {
        const customer = await prisma.customer.upsert({
            where: {email: data.email},
            update: {},
            create: data
        });

        customers.push(customer);
        console.log(`Client criado: ${customer.name}`);
    };

    const invoicesData = [{
            amount: 15785,
            status: InvoiceStatus.PENDENTE,
            data: '2026-15-05',
            customer: customers[0]
        }, {
            amount: 1578645765,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[1]
        }, {
            amount: 157435785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[2]
        }, {
            amount: 157746385,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[0]
        }, {
            amount: 15634757785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[1]
        }, {
            amount: 155678785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[2]
        }, {
            amount: 15347657785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[0]
        }, {
            amount: 1578547655,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[1]
        }, {
            amount: 15734231285,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[2]
        }, {
            amount: 152432785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[0]
        }, {
            amount: 15743243285,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[1]
        },
    ]


for (const data of invoicesData) {
    await prisma.invoice.create({
       data: {
        amount: data.amount,
        status: data.status,
        date: new Date(data.date ?? Date.now()),
        customerId: data.customer.id
       }
    });
};

console.log(`${invoicesData.length} faturas criadas.`)

    const revenueData = [
        {month: "Jan", revenue: 72167343},
        {month: "Feb", revenue: 72167343},
        {month: "Mar", revenue: 72167343},
        {month: "Apr", revenue: 72167343},
        {month: "Mai", revenue: 72167343},
        {month: "Jun", revenue: 72167343},
        {month: "Jul", revenue: 72167343},
        {month: "Ago", revenue: 72167343},
        {month: "Set", revenue: 72167343},
        {month: "Out", revenue: 72167343},
        {month: "Nov", revenue: 72167343},
        {month: "Dez", revenue: 72167343},
    ];

    for (const data of revenueData) {
        await prisma.revenue.upsert({
            where: { month: data.month},
            update: { revenue: data.revenue},
            create: data
        });
    };

    console.log ('Dados de receita mensal criados.');

    console.log('População concluida com sucesso.');
};

main()
    .catch((erro) => {
        console.log('Erro ao popular o banco:', erro);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });