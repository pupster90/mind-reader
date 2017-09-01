
from google.appengine.ext import ndb
import datetime

import user as cUser







##########################
###
###     Helpers
###
##########################

### returns current time in california
def caliTime(): return datetime.timedelta(hours=-8) + datetime.datetime.now()


# Gives the high score rankings for some specific time interval, it is a structure property of ScoreBoard
class HighScores(ndb.Model):

    userID = ndb.StringProperty(repeated=True)
    score  = ndb.FloatProperty(repeated=True)
    date   = ndb.DateTimeProperty(repeated=True)

    # Returns template of high scores with user data for use in HTML Page
    def template(self, numGet):
        #print "***********"#print "template before"#print self#print "***********"

        temp = type('', (), {})()                         #<-- create temp, which is the scores summary that we return
        temp.userID, temp.score = self.userID, self.score
        temp.homeUrl, temp.picture, temp.name, temp.gamesPlayed, temp.resets = [],[],[],[],[]

        numShow = len(self.userID) if len(self.userID) < numGet  else numGet
        #print "***********"#print "len(self.userID)", "numGet", "numShow"#print len(self.userID), numGet, numShow#print "***********"

        for i in range(numShow):
            player = cUser.User.get_by_id(id= self.userID[i] )   #<-- get user info for each high score
            #print "***********"#print "a player:"#print player#print "***********"

            # for each highscore, we add the necessary user information
            temp.gamesPlayed.append( player.gameStats.gamesPlayed )
            temp.resets.append( player.gameStats.resets )
            temp.name.append( player.name )
            temp.homeUrl.append( player.homeUrl )
            temp.picture.append( player.picture )

        #print "***********"#print "Template Result"#print temp.__dict__#print "***********"
        return temp







########################
###
###   Scoreboard     ###
###
########################

# This class contains the high scores rankings at all points in time.
# It also has many functions used for creating and updating the scoreboard

class ScoreBoard(ndb.Model):

    #############################
    ###   Initialize Stuff
    #############################
    cacheNum = ndb.IntegerProperty(default=30)  #<-- for algorithm to work, we must cache more high scores than what we show.
    toShow   = ndb.IntegerProperty(default=10)  #<-- number of high scores to show
    scores = ndb.PickleProperty()


    #############################
    ###     Update Times
    #############################
    # Updates highscore rankings based on current time. Resets highscore's if necessary.
    def updateTimes(self):
        currentTime = caliTime()
        default =  HighScores( userID=[],score=[],date= [currentTime] )

        if self.scores["Month"].date[0].month != currentTime.month:
            self.scores["Month"], self.scores["Day"], self.scores["Hour"] = default, default, default

        elif self.scores["Day"].date[0].day != currentTime.day:
            self.scores["Day"], self.scores["Hour"] = default, default

        elif self.scores["Hour"].date[0].hour != currentTime.hour:
            self.scores["Hour"] =  default

        self.put()




    ######################################
    ###     Get a ScoreBoard Template
    ######################################
    # retrieves scoreboard in a template format for use in HTML page
    def getTemplate(self):
        toReturn = []
        for key in self.scores.keys():
            temp = self.scores[key].template(self.toShow)
            temp.time = key
            toReturn.append(temp)
        return toReturn



    ######################################
    ###     Check ScoreBoard for User
    ######################################
    # checks if user scores reached a new high score, if so update scoreboard.    scores=={Total,Month,Day,Year}
    def check(self, user ): #,scores, self.scores):   #print("inside check scoreboard")
        #print; print "****************"
        #rint "Users scores: ", user.gameStats.score
        #for i in user.gameStats.score.keys():
        #    print "self.scores["+i+"] :"
        #    print self.scores[i]
        #print "****************"; print ;
        scoreChecks = {"Total":False,"Month":False,"Day":False,"Hour":False}

        #print "******" print "******" print "scores: " print scores print "self.scores:" print self.scores print "******" print "******"

        if user.key.string_id()  == "anonymous": return scoreChecks  #<-- anonymous players not added to scoreboard
        for i in user.gameStats.score.keys():
            #print; print; print "****************"
            #print "Checking scoreboard for: "+i
            score = user.gameStats.score[i]
            #print "score: ",score
            #print "self.scores["+i+"] :"
            #print self.scores[i]; print;


            # if user is already on high score board, remove user and then re-add later
            was_old = False
            if user.key.string_id()  in self.scores[i].userID:
                was_old = True
                nameIndex= self.scores[i].userID.index(user.key.string_id() )
                old_score = self.scores[i].score.pop(nameIndex)
                self.scores[i].userID.pop(nameIndex)

            # if highscores is empty      <-- must consider empy case to avoid errors
            if len(self.scores[i].userID) == 0:
                self.scores[i].userID.append(user.key.string_id() )
                self.scores[i].score.append(score)
                if was_old == False:   #<-- if user wasn't already on highscore board
                    #print "adding score"
                    scoreChecks[i] = 1

            # If user's score is actually a high score
            elif len(self.scores[i].score)< self.cacheNum or self.scores[i].score[-1]< score:
                #print "Inside 'elif len(self.scores[i].score)< self.cacheNum or self.scores[i].score[-1]< score:' "

                temp = len(self.scores[i].score)-1
                while self.scores[i].score[temp] < score and temp>-1:
                        temp -= 1
                temp += 1
                self.scores[i].score.insert(temp, score)
                self.scores[i].userID.insert(temp,user.key.string_id() )

                if len(self.scores[i].score) > self.cacheNum:    #<-- if number of scores is too big now
                    self.scores[i].score.pop()
                    self.scores[i].userID.pop()

                # Check if user reached a highscore that is shown to public
                if temp < self.toShow:
                    #print "Inside:   'if temp < self.toShow:'"
                    if was_old:
                        if temp < nameIndex:
                            #print "adding score"
                            scoreChecks[i] = 1
                    else:
                        #print "adding score"
                        scoreChecks[i] = 1

            #print "self.scores["+i+"] :"
            #print self.scores[i]; print;
            #print "****************"; print; print;

        self.put()
        return scoreChecks






scoreboard = ScoreBoard.get_by_id(id="ScoreBoard")
if not scoreboard:
    #default = HighScores( userID=[],score=[],date= [caliTime()] )
    scoreboard = ScoreBoard(id="ScoreBoard", scores={"Total":HighScores( userID=[],score=[],date= [caliTime()] ),
                                                     "Month":HighScores( userID=[],score=[],date= [caliTime()] ),
                                                     "Day":HighScores( userID=[],score=[],date= [caliTime()] ),
                                                     "Hour":HighScores( userID=[],score=[],date= [caliTime()] )   } )
    scoreboard.put()











''' Safety

    ######################################
    ###     Check ScoreBoard for User
    ######################################
    # checks if user scores reached a new high score, if so update scoreboard.    scores=={Total,Month,Day,Year}
    def check(self, user ): #,scores, self.scores):   #print("inside check scoreboard")
        scores = user.gameStats.score
        print; print "****************"
        print "Users scores: ", scores
        print "****************"; print ;
        scoreChecks = {"Total":False,"Month":False,"Day":False,"Hour":False}

        #print "******" print "******" print "scores: " print scores print "self.scores:" print self.scores print "******" print "******"

        if user.key.string_id()  == "anonymous": return scoreChecks  #<-- anonymous players not added to scoreboard
        for i in scores:
            print; print; print "****************"
            print "Checking scoreboard for: "+i
            score = scores[i]
            print "score: ",score
            highScores = self.scores[i]
            print "highScores"
            print highScores; print;


            # if user is already on high score board, remove user and then re-add later
            was_old = False
            if user.key.string_id()  in highScores.userID:
                was_old = True
                nameIndex= highScores.userID.index(user.key.string_id() )
                old_score = highScores.score.pop(nameIndex)
                highScores.userID.pop(nameIndex)

            # if highscores is empty      <-- must consider empy case to avoid errors
            if len(highScores.userID) == 0:
                highScores.userID.append(user.key.string_id() )
                highScores.score.append(score)          #highScores.put()
                if was_old == False or old_score < score :   #<-- if user wasn't already on highscore board
                    scoreChecks[i] = 1

            # If user's score is actually a high score
            elif len(highScores.score)< self.cacheNum or highScores.score[-1]< score:
                print "Checking if user score is actually a high score"
                temp = len(highScores.score)-1
                while highScores.score[temp] < score and temp>-1:
                        temp -= 1
                temp += 1
                highScores.score.insert(temp, score)
                highScores.userID.insert(temp,user.key.string_id() )

                if len(highScores.score) > self.cacheNum:    #<-- if number of scores is too big now
                    highScores.score.pop()
                    highScores.userID.pop()

                # Check if user reached a highscore that is shown to public
                if temp < self.toShow:
                    print "Inside:   'if temp < self.toShow:'"
                    if was_old:
                        if temp < nameIndex: scoreChecks[i] = 1
                        if temp == nameIndex and old_score < score: scoreChecks[i] = 1
                    else: scoreChecks[i] = 1        #highScores.put()
            print "****************"; print; print;
        return scoreChecks

'''

''' OLD CHECK FUNCTION

    ######################################
    ###     Check ScoreBoard for User
    ######################################
    # checks if user scores reached a new high score, if so update scoreboard.    scores=={Total,Month,Day,Year}
    def check(self, user ): #,scores, allHighs):   #print("inside check scoreboard")
        scores = user.gameStats.score
        print; print "****************"
        print "Users scores: ", scores
        print "****************"; print ;
        allHighs = self.scores
        scoreChecks = {"Total":False,"Month":False,"Day":False,"Hour":False}

        #print "******" print "******" print "scores: " print scores print "allHighs:" print allHighs print "******" print "******"

        if user.key.string_id()  == "anonymous": return scoreChecks  #<-- anonymous players not added to scoreboard
        for i in scores:
            print; print; print "****************"
            print "Checking scoreboard for: "+i
            score = scores[i]
            print "score: ",score
            highScores = allHighs[i]
            print "highScores"
            print highScores; print;


            # if user is already on high score board, remove user and then re-add later
            was_old = False
            if user.key.string_id()  in highScores.userID:
                was_old = True
                nameIndex= highScores.userID.index(user.key.string_id() )
                old_score = highScores.score.pop(nameIndex)
                highScores.userID.pop(nameIndex)

            # if highscores is empty      <-- must consider empy case to avoid errors
            if len(highScores.userID) == 0:
                highScores.userID.append(user.key.string_id() )
                highScores.score.append(score)          #highScores.put()
                if was_old == False:   #<-- if user wasn't already on highscore board
                    scoreChecks[i] = 1

            # If user's score is actually a high score
            elif len(highScores.score)< self.cacheNum or highScores.score[-1]< score:
                print "INSIDE:  If user's score is actually a high score"
                temp = len(highScores.score)-1
                while highScores.score[temp] < score and temp>-1:
                        temp -= 1
                temp += 1
                highScores.score.insert(temp, score)
                highScores.userID.insert(temp,user.key.string_id() )

                if len(highScores.score) > self.cacheNum:    #<-- if number of scores is too big now
                    highScores.score.pop()
                    highScores.userID.pop()

                # Check if user reached a highscore that is shown to public
                if temp < self.toShow:
                    if was_old:
                        if temp < nameIndex: scoreChecks[i] = 1
                        if temp == nameIndex and old_score < score: scoreChecks[i] = 1
                    else: scoreChecks[i] = 1        #highScores.put()
            print "****************"; print; print;
        return scoreChecks
'''