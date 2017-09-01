


from google.appengine.ext import ndb
import datetime

from bot import *
from gameStats import *


class User(ndb.Model):
    ###########################
    #   Define Variables in Class
    ###########################
    name = ndb.StringProperty()
    picture = ndb.StringProperty()
    homeUrl = ndb.StringProperty(default="None")
    hacker = ndb.BooleanProperty(default=False)

    bot   = ndb.PickleProperty()      #<-- a dictionary of all the local bots
    gameStats = ndb.StructuredProperty(GameStats)  #<-- Overall game stats for all games, all bots



    ###########################
    #   Check User Exists & is Up to Date
    ###########################
    @classmethod
    def getUser(cls, userID, username, picture, homeUrl ):
        user = cls.get_by_id( id= userID   )
        if not user:  #<-- If user does not exist, create new user
            user = User(id=userID, picture=picture, name=username, gameStats= GameStats.new(), bot= BotLocal.dict() )
            user.put()
        elif user.name != username or user.picture != picture or user.homeUrl != homeUrl :
            user.name, user.picture, user.homeUrl = username, picture, homeUrl
            user.put()     #<-- If user info out of date, update info
        return user




    ###########################
    #   Update Score Before Game Starts
    ###########################
    def updateBeforeGame(self,game):

        # Update User Info
        if not game.anonymous:
            self.gameStats.updateBeforeGame(game)
            self.bot[game.bot].gameStats.updateBeforeGame(game)    #<-- update user'scorresponding bot's gameStats
            self.put()

        # Update Global info for Bot
        botBig = BotGlobal.get_by_id( id= game.bot )
        botBig.gameStats.updateBeforeGame(game)
        botBig.put()



    ###########################
    #   Update Score After Game Ends
    ###########################
    def updateAfterGame(self, game):

        # Update User Info
        if not game.anonymous:
            self.gameStats.updateAfterGame(game)
            self.bot[game.bot].gameStats.updateAfterGame(game)     #<-- update user's corresponding bot's gameStats
            if game.result == "Hacker":
                self.hacker=True  #<-- report user if they are hacking
            self.put()

        # Update Global info for Bot
        botBig = BotGlobal.get_by_id( id= game.bot )
        botBig.gameStats.updateAfterGame(game)
        botBig.put()


