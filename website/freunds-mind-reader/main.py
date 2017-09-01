
import webapp2
import jinja2
import os
import cgi
from google.appengine.ext import ndb
from google.appengine.api import users
import math
import operator as op
import datetime
import urllib2
import time


from py.user import *
from py.game import *
from py.bot import *
from py.scoreboard import *
from py.siteCount import *


def caliTime(): return datetime.timedelta(hours=-8) + datetime.datetime.now()

gameLength= 100
template_env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.getcwd()))









##############################################
#######        Main Handler        ##########
############################################
class MainHandler(webapp2.RequestHandler):
    def get(self):   #checkit = BotGlobal.query().fetch()   #print "\n***\n"+str(checkit)+"\n***\n"
        count = SiteCount.getCount()
        template = template_env.get_template('/HTML/main.html')
        self.response.write(template.render( {'siteCount': count} ) )



    def post(self):
        result = self.request.get('result')

        # Automatically start and anonymous game if the user clicks the Beginner button
        if result == "Beginner":
            userID = self.request.get("userID")
            #user = User.getUser( self.request.get("userID"), self.request.get("username"), self.request.get("picture"), self.request.get("homeUrl") )

            speed,difficulty,bet = "Medium","Beginner",2
            anonymous = True
            bot = difficulty+"_"+speed
            gameID = str( time.time() )  #<-- we get or initilize variables to be used
            #print;print;print userID, speed,difficulty,bet,anonymous,bot; print;print;

            game = Game(id=gameID, bot=bot, userID=userID, date= caliTime(),  movesPlayer=[-1],movesComp=[-1], times=[-1],
                        result="Unfinished", mode="timed.5",  score=-bet, anonymous=anonymous, ip= self.request.remote_addr,
                        speed=speed, difficulty=difficulty, bet=bet)
            game.put()  #<-- create and save a game
            #print "********"; print game; print "********"

            user = User.get_by_id( id= userID   ) #<-- get user and update scoreboard with unfinished game
            user.updateBeforeGame(game)

            #scoreboard = ScoreBoard.get_by_id(id="ScoreBoard") #<-- We update scoreboard times before game
            scoreboard = ScoreBoard.get_by_id(id="ScoreBoard")
            scoreboard.updateTimes()

            millisMap = {"Slow":3000, "Medium":1500, "Fast":750, "Lightning":500}
            depthMap= {"Beginner":1, "Intermediate":2, "Hard":3, "Pro":500}

            templateVals= { "gameID":gameID, "depth":depthMap[difficulty], "millis":millisMap[speed], "anonymous":anonymous }
            template = template_env.get_template('/HTML/game.html')
            self.response.write(template.render( templateVals ))
            return


        # Brings User to Bots Page: result when user clicks "play!" on welcome page
        if result == "Bots":
            user = User.getUser( self.request.get("userID"), self.request.get("username"), self.request.get("picture"), self.request.get("homeUrl") )

            ### Create and Post Template
            templateVals= { "user":user, "anonymous":self.request.get("anonymous") }
            template = template_env.get_template('/HTML/bots.html')
            self.response.write(template.render( templateVals ))
            return       #print "\n***\n"+str(user)+"\n***\n"


        # Brings User to Game Page: result when user clicks "start" at Bots page
        if result == "Game":  #print("*** Inside new game creation handler")
            userID = self.request.get("userID")
            speed,difficulty,bet = self.request.get("speed"),self.request.get("difficulty"),int(self.request.get("bet"))
            anonymous = "true" == self.request.get("anonymous")
            bot = difficulty+"_"+speed
            gameID = str( time.time() )  #<-- we get or initilize variables to be used
            #print;print;print userID, speed,difficulty,bet,anonymous,bot; print;print;

            game = Game(id=gameID, bot=bot, userID=userID, date= caliTime(),  movesPlayer=[-1],movesComp=[-1], times=[-1],
                        result="Unfinished", mode="timed.5",  score=-bet, anonymous=anonymous, ip= self.request.remote_addr,
                        speed=speed, difficulty=difficulty, bet=bet)
            game.put()  #<-- create and save a game
            #print "********"; print game; print "********"

            user = User.get_by_id( id= userID   ) #<-- get user and update scoreboard with unfinished game
            user.updateBeforeGame(game)

            #scoreboard = ScoreBoard.get_by_id(id="ScoreBoard") #<-- We update scoreboard times before game
            scoreboard = ScoreBoard.get_by_id(id="ScoreBoard")
            scoreboard.updateTimes()

            millisMap = {"Slow":3000, "Medium":1500, "Fast":750, "Lightning":500}
            depthMap= {"Beginner":1, "Intermediate":2, "Hard":3, "Pro":500}

            templateVals= { "gameID":gameID, "depth":depthMap[difficulty], "millis":millisMap[speed], "anonymous":anonymous }
            template = template_env.get_template('/HTML/game.html')
            self.response.write(template.render( templateVals ))
            return



        #####################################
        #               *  *                #
        ### The post for a finished game: ###
        #                **                 #
        #####################################
        #print("made it this far: 1")

        #######################
        ###  Get variables  ###
        #######################
        result = cgi.escape(self.request.get('result'))
        gameID= cgi.escape(self.request.get('gameID'))
        compScore = int( cgi.escape(self.request.get('blueScoreFinal')) )

        times = str( cgi.escape(self.request.get('times_new')) ).split(' ')
        times.pop(0)                                                       #print(times)
        timesOG2 = [int(numeric_string) for numeric_string in times]       #print(timesOG2)
        times=[0]
        for i in range(1,len(timesOG2)):
            newTime = (timesOG2[i]-timesOG2[i-1])/10
            times.append( newTime )

        youHistory = str( cgi.escape(self.request.get('youHistory')) ).split(',')
        youHistory = [int(numeric_string) for numeric_string in youHistory]
        compHistory = str( cgi.escape(self.request.get('compHistory')) ).split(',')
        compHistory = [int(numeric_string) for numeric_string in compHistory]

        margin = (len(compHistory)-compScore) - compScore


        ###########################
        ###  Check For Hacking  ###
        ##########################
        '''
        print("made it this far: 2")
        print("Time taken: "+str(sum(times)))

        if result == "Loser":
            if scoreOG >= 0:
                result = "Hacker"
        if result == "Winner":
            if scoreOG >49 or len(compHistory) != len(youHistory):
                result= "Hacker"
            if len(times) != len(compHistory) or sum(times)<1000 or sum(times)>15900 :
                result= "Hacker"

            check100, compScoreCheck, consec, longestConsec = 0, 0, 0, 0
            for i in range(len(compHistory)):
                temp= abs(youHistory[i]-compHistory[i])
                check100 += temp
                compScoreCheck += abs( temp-1)
                if temp == 1:
                    consec +=1
                else: consec=0
                if consec> longestConsec:
                    longestConsec= consec
            if check100 != 100 or check100 - compScoreCheck != scoreOG or longestConsec > 24:
                result = "Hacker"
        '''

        # Get game and user data. Handle any possible errors.
        game =  Game.get_by_id(id= gameID)
        user = User.get_by_id( id=game.userID )
        if not user:
            self.response.write("Error" )
            return
        if not game:
            result = "Hacker"
        elif game.result != "Unfinished" :
            self.response.write("Error")
            return
        score   = -game.bet if  (margin < 0) else game.bet #<-- use the game.bet to compute the user's score
        #print(" \n***") #print("score") #print(score )#print("***\n ")



        ##########################
        ###  Save and Update   ###
        ##########################
        game.movesPlayer, game.movesComp = youHistory, compHistory   #<-- code block updates the game's data
        game.times, game.result, game.score, game.margin = times, result, score, margin
        game.put()
        user.updateAfterGame(game)

        if not game.anonymous:
            ### Update Scoreboard and check if user set any high scores
            scoreboard = ScoreBoard.get_by_id(id="ScoreBoard")    # print "User before ", user.gameStats.score
            scoreChecks =  scoreboard.check( user)
            numHighScores= sum(scoreChecks.values())

            #print "****************"
            #print "Finished scoreboard.check(usere):"
            #print "scoreChecks", scoreChecks
            #print "game.anonymous", game.anonymous
            #print "number of high scores", numHighScores
            #print "Scoreboard:"
            #print scoreboard
            #print "****************"; print;

        else:
            numHighScores = 0




        if result=="TimeOut" or result=="Cheater" or result=="Hacker": score = -game.bet

        if numHighScores > 0:    #<-  If the player has set a new highscore, setup highscore webpage
            href ="/scoreboard/?result=HighScore&username="
            href += urllib2.quote(user.name.encode("utf8"))
            for newHigh in scoreChecks:
                if scoreChecks[newHigh]: href += "&newHighs="+newHigh
            href += "&points="+str(score)

            self.redirect(href)
            return

        if   result== "Loser" or result== "Winner" or result == "Cheater" or result == "Hacker" or result=="TimeOut" :
            self.redirect("/scoreboard/?result="+result+"&points="+str(score)  )
        else: self.response.write("Error" )  #<- if none of the other redirect's occured there must have been an error
        return









##############################################
#######       Other Handlers       ##########
############################################

class Anonymous(webapp2.RequestHandler):
    def get(self):   #checkit = BotGlobal.query().fetch()   #print "\n***\n"+str(checkit)+"\n***\n"
        count = SiteCount.getCount()
        template = template_env.get_template('/HTML/anonymous.html')
        self.response.write(template.render( {'siteCount': count} ) )


class About(webapp2.RequestHandler):
    def get(self):
        template = template_env.get_template('/HTML/about.html')
        self.response.write(template.render() )


class Scores(webapp2.RequestHandler):
    def get(self):
        template = template_env.get_template('/HTML/scoreboard.html')
        result = self.request.get("result")
        templateVals = dict( username="  ", newHighs=[], result=result, scores=None )

        scoreboard = ScoreBoard.get_by_id(id="ScoreBoard")
        if result == "View":
            scoreboard.updateTimes()

        temp = scoreboard.getTemplate()
        #print "************"#print "scoreboard template"#for i in temp:#    print i.__dict__ #print "************"

        templateVals["scores"]=  temp
        templateVals["new_points"]= float(self.request.get("points")) if templateVals["result"]!="View" else 0.0

        if templateVals["result"] == "HighScore":
            username = self.request.get("username")
            templateVals["username"] = urllib2.unquote(username).decode("utf8")
            newHighs = self.request.get_all("newHighs")
            templateVals["newHighs"] = [ x.encode('ascii','ignore') for x in newHighs]

        self.response.write(template.render( templateVals ))


class Stats(webapp2.RequestHandler):
    def get(self):
        userID = self.request.get("num")
        templateVals = { "user": User.get_by_id(id=userID) }

        template = template_env.get_template('/HTML/stats.html')
        self.response.write( template.render(templateVals) )






app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/stats/.*',Stats),
    ('/about',About),
    #      adf asdf asdf
    ('/anonymous',Anonymous),
    #      asdf asdf asdf
    ('/scoreboard/.*',Scores)
], debug=True)





