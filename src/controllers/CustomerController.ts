import { z } from 'zod';
import {
  createCustomer, 
  deleteCustomer, 
  findAllCustomers, 
  findCustomerById, 
  updateCustomer
} from '@/services/CustomerServices';
import { ApiError } from '@/types';
import { get } from 'http';
import { create } from 'domain';

export const createCustomerSchema = z.object({
  name: z
  .string({ required_error: 'O campo é obrigatório' })
  .min(1, 'O campo não pode estar vazio')
  .max(100, 'O campo deve conter no máximo 100 caracteres'),

  email: z
  .string({ required_error: 'O campo é obrigatório' })
  .email('O campo possui um formato de email inválido'),
  
  imageUrl: z
  .string({required_error: 'O campo é obrigatório' })
  .url('O campo possui um formato de URL inválido'),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>; 
export type UpdateCustomerDTO = z.infer<typeof updateCustomerSchema>;

function buildErrorResponse(
  message: string,
  details?: Record<string, string[]>
): ApiError {

  if (details) {
    return { error: message, details };
  };

  return { error: message };
};

export const CustomerController = {
  async getAll(searchParams: URLSearchParams) {
    const search = searchParams.get('search') ?? undefined;

    const customer = await findAllCustomers({ search });

    return {status: 200, body: customer};
  },

  async getById(id: string) {
    const customer = await findCustomerById(id);  

    if (!customer) {
      return {
        status: 404,
        body: buildErrorResponse('Cliente não encontrado'),
      };
    };
    return {status: 200, body: customer};
  },

  async create(data: unknown) {
    const parsed = createCustomerSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: 400,
        body: buildErrorResponse('Dados inválidos', 
          parsed.error.flatten().fieldErrors as Record<string, string[]>)
      };
    };

    const customer = await createCustomer(parsed.data);

    return {status: 201, body: customer};
  },

  async update(id: string, data: unknown) {
    const existing = findCustomerById(id);

    if (!existing) {
      return {
        status: 404,
        body: buildErrorResponse('Cliente não encontrado'),
      };
    };

    const parsed = updateCustomerSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: 400,
        body: buildErrorResponse('Dados inválidos', 
          parsed.error.flatten().fieldErrors as Record<string, string[]>)
      };
    };

    const updated = await updateCustomer(id, parsed.data);

    return {status: 200, body: updated};
  },

  async delete(id: string) {
    const existing = findCustomerById(id);

    if (!existing) {
      return {
        status: 404,
        body: buildErrorResponse('Cliente não encontrado'),
      };
    };

    await deleteCustomer(id);

    return {status: 200, body: { message: 'Cliente removido com sucesso' }};
  } 
};
