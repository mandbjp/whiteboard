#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket

from tornado.options import define, options

import json
import sqlite3
from threading import RLock

define("port", default=8888, help="run on the given port", type=int)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("canvas.html")

class ImageHandler(tornado.web.RequestHandler):
    def get(self, url):
        #print url
        self.render('img/%s' % url)

cone = []
history = None
artistCount = 0
players = []

class PlayerObject(object):
    def __init__(self, cone):
        self.id   = -1
        self.name = 'JOHNDOE'
        self.cone = cone

    def getCone(self):
        return self.cone

    def setName(self, name):
        self.name = name

    def setId(self, id):
        self.id = id



class SocketHandler(tornado.websocket.WebSocketHandler):
    # def __init__(self, application, request, **kwargs):
    #     tornado.websocket.WebSocketHandler.__init__(self, application, request, **kwargs)

    def open(self):
        global artistCount, players
        player = None
        if self not in cone:
            cone.append(self)
            player = PlayerObject(self)
            player.name = "Artist%03d" % artistCount
            artistCount += 1
            players.append(player)
        print "-------------------"
        print "connected"
        print cone
        print "--------------------"
        print player.name


    def on_close(self):
        if self in cone:
            cone.remove(self)
        print "------------------"
        print "dis-connected"
        print cone
        print "-------------------"

    def on_message(self,message):
        js = json.loads(message)
        print '[WS]command: ' + js['command']

        if (js['command'] == 'PING'):
            ret = {'command': 'PONG'}
            self.write_message(json.dumps(ret))
            return

        if (js['command'] == 'DRAW_STROKES'):
            history.insert(message)

        if (js['command'] == 'UNDO_DRAW'):
            msg = history.undo()
            for i in cone:
                i.write_message(msg)
            return


        if (js['command'] == 'CLEAR_SCREEN'):
            history.clear()

        if (js['command'] == 'RETRIVE_HISTORY'):
            history.retrive(self)
            return

        for i in cone:
            if (i == self):
                continue
            i.write_message(message)


class HistoryDB(object):
    def __init__(self):
        self.db = None;

    def init(self):
        self.db = sqlite3.connect(':memory:', isolation_level=None)
        sql = u"""
            CREATE TABLE history(
                no INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT
            );
        """
        self.db.execute(sql)

    def insert(self, message):
        sql = "INSERT INTO history(message) VALUES(?)"
        self.db.execute(sql, [message])

    def undo(self):
        # SQLの最終行を取得
        sql = u"SELECT message FROM history WHERE no = (SELECT MAX(no) FROM history);"
        c = self.db.execute(sql)
        row = c.fetchone()
        if row == None:
            return json.dumps([])
        message = row[0]

        # SQL最終行を削除しておく
        sql = u"DELETE FROM history WHERE no = (SELECT MAX(no) FROM history);"
        self.db.execute(sql)

        jsonMessage = json.loads(message)
        jsonMessage['color'] = '#FFF'
        return json.dumps(jsonMessage)

    def retrive(self, cone):
        sql = u"SELECT message FROM history;"
        c = self.db.execute(sql)
        count = 0
        for row in c:
            cone.write_message(row[0])
            count += 1
        print "history count: %d" % (count)

    def clear(self):
        sql = u"DELETE FROM history;"
        self.db.execute(sql)


def main():
    tornado.options.parse_command_line()
    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/websocket", SocketHandler),

        (r"/img/(.*)", ImageHandler),
    ])

    print "server starting at PORT=%d" % options.port
    global history
    history = HistoryDB()
    history.init()

    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
