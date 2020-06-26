/**
 * Checker Script for mooc_git-entrega4_branch
 */


// IMPORTS
const git = require('simple-git/promise');
const Utils = require("./utils");
const to = require("./to");
const path = require('path');
const fs = require('fs-extra');



// CONSTS
const REPO_NAME = 'MOOC_git_mod7-cal_2com';
const PATH_ASSIGNMENT = path.resolve(path.join(__dirname, "../"));
const PATH_REPO = path.join(PATH_ASSIGNMENT, REPO_NAME);
const BRANCH_NAME = "inverse";

// GLOBALS
let error_critical1 = null;
let error_critical2 = null;
let output = null;
let mygit = git(PATH_ASSIGNMENT);
let account_student = null;
let account_auxiliary = null;
let REPO_URL = "";
//`https://github.com/${account_student}/${REPO_NAME}`;
let AUXILIARY_REPO_URL = "";
//`https://github.com/${account_auxiliary}/${REPO_NAME}`;


describe('Pull Request', function () {

    it("(Prechecks) Comprobando que existe 'git_account'", async function () {
        this.score = 0;
        this.msg_err = "No se ha encontrado el fichero 'git_account' que debe contener el nombre de usuario de github";

        account_student = fs.readFileSync(path.join(PATH_ASSIGNMENT, 'git_account'), {encoding: 'utf8'}).replace(/^\s+|\s+$/g, '');;
        REPO_URL = `https://github.com/${account_student}/${REPO_NAME}`;
        this.msg_ok = `Se ha encontrado el fichero 'git_account': ${account_student}`;
        should.exist(account_student);
    });

    it("(Prechecks) Comprobando que existe 'git_account2'", async function () {
        this.score = 0;
        this.msg_err = "No se ha encontrado el fichero 'git_account2' que debe contener el nombre de usuario de github";

        account_auxiliary = fs.readFileSync(path.join(PATH_ASSIGNMENT, 'git_account2'), {encoding: 'utf8'}).replace(/^\s+|\s+$/g, '');;
        AUXILIARY_REPO_URL = `https://github.com/${account_auxiliary}/${REPO_NAME}`;
        this.msg_ok = `Se ha encontrado el fichero 'git_account2': ${account_auxiliary}`;
        should.exist(account_auxiliary);
    });

    it(`Comprobando que existe el repositorio '${REPO_NAME}' en el segundo usuario`, async function () {
        const expected = AUXILIARY_REPO_URL;
        this.score = 1;
        this.msg_ok = `Encontrado ${expected}`;
        [_, _] = await to(fs.remove(PATH_REPO));
        [error_repo, _] = await to(mygit.clone(expected));
        if (error_repo) {
            this.msg_err = `No se encuentra ${expected}`;
            error_critical1 = this.msg_err;
            should.not.exist(error_critical1);
        }
        await to(mygit.cwd(PATH_REPO));
        should.not.exist(error_repo);
    });



    it(`Comprobando que el repositorio auxiliar tiene la rama '${BRANCH_NAME}'`, async function () {
        const expected = BRANCH_NAME;
        this.score = 1;
        if (error_critical1) {
            this.msg_err = error_critical1;
            should.not.exist(error_critical1);
        } else {
            let output;
            this.msg_ok = `Encontrada la rama '${BRANCH_NAME}'`;
            [error_branch, branches] = await to(mygit.branch());
            if (error_branch) {
                this.msg_err = `Error al leer las ramas en ${PATH_REPO}`;
                error_critical1 = this.msg_err;
                should.not.exist(error_critical1);
            } else {
                output = branches.all;
            }
            const no_branch = !Utils.search(expected, output);
            if (no_branch){
                this.msg_err = `No se encuentra la rama '${BRANCH_NAME}' en ${AUXILIARY_REPO_URL}`;
                error_critical1 = this.msg_err;
                should.not.exist(error_critical1);
            }
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it(`Comprobando que la rama 'master' está integrada en '${BRANCH_NAME}' en el repositorio auxiliar`, async function () {
        const expected = "inverse";
        this.score = 1;
        if (error_critical1) {
            this.msg_err = error_critical1;
            should.not.exist(error_critical1);
        } else {
            this.msg_ok = `La rama 'master' está integrada en '${BRANCH_NAME}' en ${AUXILIARY_REPO_URL}`;
            [error_log, log] = await to(mygit.log([`origin/${BRANCH_NAME}`]));
            if (error_log) {
                this.msg_err = `Error al leer los logs de ${PATH_REPO}`;
                error_critical1 = this.msg_err;
                should.not.exist(error_critical1);
            }
            let output = log.all[0]["message"];
            this.msg_err = `'${expected}' no se ha encontrado en el último commit de la rama '${BRANCH_NAME}' en '${AUXILIARY_REPO_URL}'`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it(`Comprobando que la rama '${BRANCH_NAME}' está integrada en 'master' en el repositorio auxiliar`, async function () {
        const expected = "inverse";
        this.score = 2;
        if (error_critical1) {
            this.msg_err = error_critical1;
            should.not.exist(error_critical1);
        } else {
            this.msg_ok = `La rama '${BRANCH_NAME}' está integrada en 'master' en ${AUXILIARY_REPO_URL}`;
            [error_log, log] = await to(mygit.log());
            if (error_log) {
                this.msg_err = `Error reading logs from ${PATH_REPO}`;
                error_critical1 = this.msg_err;
                should.not.exist(error_critical1);
            }
            let output = log.all[0]["message"];
            this.msg_err = `'${expected}' no se ha encontrado en el último commit de la rama 'master' en '${AUXILIARY_REPO_URL}'`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it(`Comprobando que existe el repositorio principal`, async function () {
        const expected = REPO_URL;
        this.score = 1;
        this.msg_ok = `Se ha encontrado ${expected}`;
        await to(mygit.cwd(PATH_ASSIGNMENT));
        [_, _] = await to(fs.remove(PATH_REPO));
        [error_repo, _] = await to(mygit.clone(expected));
        if (error_repo) {
            this.msg_err = `No se encuentra ${expected}`;
            error_critical2 = this.msg_err;
            should.not.exist(error_critical2);
        }
        await to(mygit.cwd(PATH_REPO));
        should.not.exist(error_repo);
    });

    it(`Comprobando que la rama ${BRANCH_NAME} está integrada en la rama 'master' del repositorio principal`, async function () {
        const expected = "inverse";
        this.score = 2;
        if (error_critical1) {
            this.msg_err = error_critical1;
            should.not.exist(error_critical1);
        } else {
            this.msg_ok = `Se ha encontrado '${expected}' en la rama 'master' de ${REPO_URL}`;
            [error_log, log] = await to(mygit.log());
            if (error_log) {
                this.msg_err = `Error al leer los logs de ${PATH_REPO}`;
                error_critical1 = this.msg_err;
                should.not.exist(error_critical1);
            }
            let output = log.all[1]["message"];
            this.msg_err = `No se ha encontrado '${expected}' en el penúltimo commit del repositorio principal de la rama 'master'`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it("Comprobando que la rama 'master' del repositorio principal contiene una Pull Request", async function () {
        const expected = "pull request";
        this.score = 2;
        if (error_critical1) {
            this.msg_err = error_critical1;
            should.not.exist(error_critical1);
        } else {
            this.msg_ok = `Se ha encontrado '${expected}' en la rama master de ${REPO_URL}`;
            [error_log, log] = await to(mygit.log());
            if (error_log) {
                this.msg_err = `Error al leer los logs de ${PATH_REPO}`;
                error_critical1 = this.msg_err;
                should.not.exist(error_critical1);
            }
            let output = log.all[0]["message"];
            this.msg_err = `No se ha encontrado '${expected}' en el último commit del repositorio principal de la rama 'master'`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });
});
