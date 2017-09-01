
from google.appengine.ext import ndb


class Game(ndb.Model):

    mode= ndb.StringProperty()
    bot = ndb.StringProperty()
    anonymous = ndb.BooleanProperty()
    speed = ndb.StringProperty()
    difficulty = ndb.StringProperty()
    bet = ndb.IntegerProperty()

    userID = ndb.StringProperty()
    date= ndb.DateTimeProperty()
    ip = ndb.StringProperty()

    result= ndb.StringProperty()
    score= ndb.FloatProperty()
    margin = ndb.IntegerProperty()

    movesPlayer = ndb.IntegerProperty(repeated=True)
    movesComp = ndb.IntegerProperty(repeated=True)
    times = ndb.IntegerProperty(repeated=True)









