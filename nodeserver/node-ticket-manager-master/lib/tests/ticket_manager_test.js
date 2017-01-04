// Generated by CoffeeScript 1.8.0

/*
 * test for ticket_manager
 */

(function() {
  var TicketManager, debuglog, should, ticketManager;

  should = require("should");

  TicketManager = require("../").TicketManager;

  debuglog = require("debug")("ticketman:test:ticket_manager_test");

  ticketManager = new TicketManager("test ticket_manager", "http://localhost:3456");

  describe("test ticket_manager", function() {
    before(function() {});
    return describe("issue", function() {
      return it("ticket", function(done) {
        var category, content, title;
        content = {
          detailed: "content of ticket",
          mixed: ["data"]
        };
        title = "test ticket " + (Date.now());
        category = "sample";
        return ticketManager.issue(title, category, content, function(err, ticket) {
          debuglog("err:" + err + ", ticket:%j", ticket);
          should.not.exist(err);
          should.exist(ticket);
          ticket.title.should.eql(title);
          ticket.category.should.eql(category);
          should.exist(ticket.id);
          return ticketManager.issue(title, category, content, function(err, ticket) {
            debuglog("err:" + err + ", ticket:%j", ticket);
            should.exist(err);
            should.not.exist(ticket);
            return done();
          });
        });
      });
    });
  });

}).call(this);
