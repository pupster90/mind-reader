



from google.appengine.ext import ndb
import datetime

def caliTime(): return datetime.timedelta(hours=-8) + datetime.datetime.now()
initial_score = 5


class GameStats(ndb.Model):
    gameKeys = ndb.KeyProperty(repeated=True)

    count = ndb.PickleProperty()
    score = ndb.PickleProperty()
    hist  = ndb.PickleProperty()

    lastPlayed = ndb.DateTimeProperty(default= caliTime() )
    bestGame = ndb.IntegerProperty(default= 0)
    gamesPlayed = ndb.IntegerProperty(default= 0)
    resets = ndb.IntegerProperty(default= 0)

    ifWinTotal = ndb.IntegerProperty(default= 0) #<-- temporary helper var. In updateBeforeGame, records new score["Total"] if player wins


    @classmethod
    def new(cls):
        return GameStats( gameKeys=[],
                          score={"Total":initial_score,"Month":0,"Day":0,"Hour":0},
                          count={"Winner":0,"Loser":0,"Unfinished":0,"TimeOut":0,"Cheater":0},
                          hist ={"scores":[],"dates":[]}
                          )


    def updateBeforeGame(self,game):
        self.ifWinTotal = self.score["Total"] + game.bet  #<-- ifWinTotal stores resulting score from winning game
        for i in self.score:         #<-- before the game starts we subtract the player's score
            self.score[i] -= game.bet
        if self.score["Total"] < 1:  #<-- score["Total"] is not allowed to be less than 1
            self.score["Total"] = 1

        ###   Update the  score history dataset
        self.hist["scores"].append( self.score["Total"] )
        self.hist["dates"].append(game.date)
        self.count["Unfinished"] += 1

        self.gamesPlayed += 1
        self.gameKeys.append(game.key)
        return




    def updateAfterGame(self, game):

        ###   Resets User Scores for outdated dates
        if self.lastPlayed.month != game.date.month:
            self.score["Month"],self.score["Day"],self.score["Hour"] = -game.bet,-game.bet,-game.bet
        elif self.lastPlayed.day != game.date.day:
            self.score["Day"],self.score["Hour"] = -game.bet,-game.bet
        elif self.lastPlayed.hour != game.date.hour:
            self.score["Hour"] = -game.bet              #print(self.scoreHour)

        ### FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX
        ###   Adjust the hacker count if player hacked
        self.count["Unfinished"] += -1
        for key in self.count:
            if game.result == key:  self.count[key] += 1
        if game.result == "Hacker": self.count["Hacker"] += 1

        ###   Adjusts the score if the user won
        if game.result == "Winner":
            for key in self.score:
                self.score[key] += game.bet*2
            self.score["Total"] = self.ifWinTotal

        ###   Update Score History Dataset
        self.hist["dates"][-1] = game.date
        self.hist["scores"][-1] = self.score["Total"]

        ###  Update bestGame and lastPlayed
        if self.bestGame < game.margin:
            self.bestGame = game.margin
        self.lastPlayed = game.date
        return







