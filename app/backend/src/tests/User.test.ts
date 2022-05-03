import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import UserModel from '../database/models/UsersModel';
import { app } from '../app';
import { User } from './mocks';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes para a tabela Users, na rota /login', () => {
 
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(User as UserModel);
    
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    })

    it('Retorna um erro caso o campo email esteja vazio', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({password: 'secret_admin'});

        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('All fields must be filled');
    });

    it('Retorna um erro caso o campo password esteja vazio', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 'admin@admin.com'});

        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('All fields must be filled');
    });

    it('Retorna um erro caso o campo email esteja incorreto', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 'admin@admin'});

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('Incorrect email or password');
    });

    it('Retorna um erro caso email ou password não sejam strings', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 11111, password: 111111});

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('Invalid email or password');
    });

    it('Retorna um erro caso email ou password não sejam strings', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 11111, password: 111111});

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('Invalid email or password');
    });

    it('Retorna um erro caso password possua menos de 7 caracteres', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 'admin@admin.com', password: 111111});

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('Invalid email or password');
    });

    it('Retorna um erro caso password possua menos de 7 caracteres', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 'admin@admin.com', password: 111111});

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.deep.equal('Invalid email or password');
    });

    it('Retorna status 200 quando é possível realizar o login ', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login')
        .send({email: 'admin@admin.com', password: 'secret_admin'});

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body.user).to.be.deep.equal(User);
        expect(chaiHttpResponse.body.token).to.be.an('string');
    });
  });
});

describe('Testes para a tabela Users, na rota /login/validate', () => {
 
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(User as UserModel);
    
    after(()=>{
      (UserModel.findOne as sinon.SinonStub).restore();
    })

    it('Caso ocorra a validação com sucesso, retorna status 200 ', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMDA3OTc2LCJleHAiOjE2NTE2MTI3NzZ9.e03flklFuSWr96-87vAZwivEFgtQdO7s_yXFzUYF4m4' });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.an('string');
    });

    it('Quando o token não é encontrado', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ });

      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.deep.equal('Token not found');
    });

    it('Quando o token esta incorreto', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' });

      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.deep.equal('Invalid token');
    });
  });
});


