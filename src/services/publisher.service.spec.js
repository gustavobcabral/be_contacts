import publisherService from './publishers.service'
import { omit } from 'lodash/fp'
import { GET_OK } from '../shared/constants/db.constant'

describe('Service Publishers', () => {
  test('no data because this user only can get data with id_responsibility <= 1', async () => {
    const request = { user: { id: 1, id_responsibility: 1 }, method: 'GET' }
    const data = await publisherService.get(request)
    expect(data).toEqual({
      cod: 'GET_SUCCESSFUL',
      data: [],
      status: true
    })
  })

  test('all data without password', async () => {
    const request = { user: { id: 1, id_responsibility: 4 }, method: 'GET' }
    const data = await publisherService.get(request)
    expect(data).toEqual({
      cod: 'GET_SUCCESSFUL',
      data: [
        {
          id: 1,
          name: 'Admin',
          email: 'admin@example.com',
          id_responsibility: 4,
          active: true,
          createdAt: new Date('2020-08-31T13:59:35.232Z'),
          hash: null
        }
      ],
      status: true
    })
  })

  test('one data without password', async () => {
    const request = {
      user: { id: 1, id_responsibility: 4 },
      method: 'GET',
      params: { id: 1 }
    }
    const data = await publisherService.getOne(request)
    expect(data).toEqual({
      cod: GET_OK,
      data: {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        id_responsibility: 4,
        active: true,
        createdAt: new Date('2020-08-31T13:59:35.232Z'),
        hash: null
      },
      status: true
    })
  })

  test('create a new publisher with weak password (4 characters) must fail', async () => {
    const request = {
      user: { id: 1, id_responsibility: 4 },
      method: 'GET',
      body: {
        name: 'test',
        email: 'test@example.com',
        id_responsibility: 1,
        password: 'test'
      }
    }
    try {
      await publisherService.create(request)
    } catch (error) {
      expect(error).toEqual({
        error: 'ERROR_PASSWORD_MINIMUM_LENGTH',
        httpErrorCode: 400
      })
    }
  })

  test('create a new publisher with weak password (need a uppercase letter) must fail', async () => {
    const request = {
      user: { id: 1, id_responsibility: 4 },
      method: 'GET',
      body: {
        name: 'test',
        email: 'test@example.com',
        id_responsibility: 1,
        password: 'testtest'
      }
    }
    try {
      await publisherService.create(request)
    } catch (error) {
      expect(error).toEqual({
        error: 'ERROR_PASSWORD_UPPERCASE_LETTER',
        httpErrorCode: 400
      })
    }
  })

  test('create a new publisher with weak password (need a number) must fail', async () => {
    const request = {
      user: { id: 1, id_responsibility: 4 },
      method: 'GET',
      body: {
        name: 'test',
        email: 'test@example.com',
        id_responsibility: 1,
        password: 'Testtest'
      }
    }
    try {
      await publisherService.create(request)
    } catch (error) {
      expect(error).toEqual({
        error: 'ERROR_PASSWORD_NUMBER',
        httpErrorCode: 400
      })
    }
  })

  test('create a new publisher with weak password (need a special character) must fail', async () => {
    const request = {
      user: { id: 1, id_responsibility: 4 },
      method: 'GET',
      body: {
        name: 'test',
        email: 'test@example.com',
        id_responsibility: 1,
        password: 'T1esttest'
      }
    }
    try {
      await publisherService.create(request)
    } catch (error) {
      expect(error).toEqual({
        error: 'ERROR_PASSWORD_SPECIAL_CHARACTER',
        httpErrorCode: 400
      })
    }
  })

  test('create a new publisher with strong password', async () => {
    const payload = {
      name: 'test',
      email: 'test@example.com',
      id_responsibility: 1,
      password: 'T1:esttest',
      active: true,
      createdAt: new Date('2020-08-31T13:59:35.232Z'),
      hash: null
    }
    const response = {
      cod: GET_OK,
      status: true,
      data: [{ id: 2, ...omit('password', payload) }]
    }

    const request = {
      user: { id: 1, id_responsibility: 4 },
      method: 'GET',
      body: payload
    }
    const data = await publisherService.create(request)
    expect(data).toEqual(response)
  })
})
