import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import TeamModel from '../database/models/TeamsModel';
import { app } from '../app';
import { listAllTeams, notFindTeam, teamById } from './mocks';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes para a tabela Teams, na rota /teams', () => {
 
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(TeamModel, "findAll")
      .resolves(listAllTeams as TeamModel[]);
    sinon
      .stub(TeamModel, "findAll")
      .resolves(notFindTeam as TeamModel[]);
  
    after(()=>{
      (TeamModel.findAll as sinon.SinonStub).restore();
    })

    it('Lista todos os times e o status code é 200', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams');

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(listAllTeams);
    });

    it('Retorna um array vazio, com status code 404', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams');

        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.deep.equal(notFindTeam);
    });
  });
});

describe('Testes para a tabela Teams, na rota /teams:id', () => {
 
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(TeamModel, "findByPk")
      .resolves(teamById as TeamModel);
    sinon
      .stub(TeamModel, "findByPk")
      .resolves( null);
  
    after(()=>{
      (TeamModel.findByPk as sinon.SinonStub).restore();
    })

    it('Encontra o time pelo id e o status code é 200', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams/:id')
        .send({id: 12});

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(teamById);
    });

    it('Não encontra nenhum time com o id recebido, retornando null e  status code 404', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams')
        .send({id: 30});

        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.deep.equal(null);
    });
  });
});

