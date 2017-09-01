
from google.appengine.ext import ndb
from scoreboard import *
from gameStats import *

def caliTime(): return datetime.timedelta(hours=-8) + datetime.datetime.now()



##########################
###     Bot Class: Base Class user to define data structure for Bots
##########################

class BotGlobal(ndb.Model):
    name       = ndb.StringProperty()
    bet        = ndb.IntegerProperty()
    difficulty = ndb.StringProperty()
    speed      = ndb.StringProperty() #locked     = ndb.BooleanProperty()
    gameStats  = ndb.StructuredProperty(GameStats)  #<-- dictionary o

    color      = ndb.StringProperty(default="")  #<-- Used only by html to assign colors to squares





##########################
###     Class that Stores Bot Info for Single User
##########################

class BotLocal(BotGlobal):

    ###   Creates Initialized Bot Dictionary for New User
    @classmethod
    def dict(cls):
        botDict = {}
        allBots = BotGlobal.query().fetch()
        for i in allBots:
            botDict[i.name]= BotLocal( id=i.name, name=i.name, difficulty=i.difficulty, speed=i.speed, bet=i.bet,
                                        color=i.color, gameStats= GameStats.new() )
        return botDict






##########################
###     Create Initial Bots for Website
##########################

bot = BotGlobal.get_by_id(id="Hard_Fast")
if not bot:
    speed = ["Slow","Medium","Fast","Lightning"]
    difficulty = ["Beginner","Intermediate","Hard","Pro"]

    count = 0
    for d in range(len(difficulty)):
        for s in range(len(speed)):
            count +=1
            name = difficulty[d]+"_"+speed[s]
            bet  = 4**d *(s+1)

            bot = BotGlobal( id=name, name=name, difficulty=difficulty[d], speed=speed[s], bet=bet, gameStats= GameStats.new() )
            if count%2 == 0:
                bot.color= "s2"
            bot.put()

            if s == 3:  #<-- this statement is used to assign "s2" to correct bot.color variable
                count += 1
