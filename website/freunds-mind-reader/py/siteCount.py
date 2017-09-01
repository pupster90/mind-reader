

from google.appengine.ext import ndb



class SiteCount(ndb.Model):
    count = ndb.IntegerProperty()

    @classmethod
    def getCount(cls):
        siteCount = cls.get_by_id(id='SITE_COUNT')
        siteCount.count = siteCount.count+1
        siteCount.put()
        return siteCount.count





#######################################
#   Add Counter if it does Not Exist
#######################################
siteCount = SiteCount.get_by_id(id='SITE_COUNT')
if not siteCount:
    SiteCount(id= 'SITE_COUNT', count=1 ).put()


