const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const should = chai.should();

chai.use(chaiHttp);

describe('Blog', function () {

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    })

    //GET (200) test
    it(`Should list Blog posts`, function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                res.should.be.json;
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ["title", "content", "author"];
                res.body.forEach(function (info) {
                    info.should.be.a('object');
                    info.should.include.keys(expectedKeys);
                })
            })
    })

    //POST (201) test
    it(`Should add a Blog post`, function () {
        const newPost = { title: "The Title", content: "The content", author: "The Author" };
        const expectedKeys = ["id", "title", "content", "author"]
        return chai.request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.include.keys(expectedKeys);
                res.body.title.should.equal(res.body.title);
                res.body.content.should.equal(res.body.content);
                res.body.author.should.equal(res.body.author);
            })
    })

    //POST (400) error
    it(`Should throw error for bad POST`, function () {
        const badInput = {};
        return chai.request(app)
            .post('/blog-posts')
            .send(badInput)
            .then(function (res) {
                res.should.have.status(400);
            })
    })

    //PUT (204) test
    it(`Should update a Blog post`, function () {
        
        return (
            chai.request(app)
                .get('/blog-posts')
                .then(function (res) {
                    const updatedPost = Object.assign(res.body[0], {
                        title: "The Title",
                        content: "The content",
                        author: "The Author"

                    });
                    return chai.request(app)
                        .put(`/blog-posts/${updatedPost.id}`)
                        .send(updatedPost)
                        .then(function (res) {
                            res.should.have.status(204);
                        })
                })
          )
    })

    //DELETE (204) test
    it(`Should delete a Blog post`, function () {
        return(
            chai.request(app)
                .get('/blog-posts')
                .then(function (res) {
                    return chai
                        .request(app)
                        .delete(`/blog-posts/${res.body.id}`)
                        .then(function (res) {
                            res.should.have.status(204);
                        })
                })
        )
    })
})