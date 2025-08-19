import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';

const departmentLeaderboard = [
  {
    rank: 1,
    department: "Marketing",
    participants: 15,
    submissions: 23,
    likes: 456,
    engagement: 92
  },
  {
    rank: 2,
    department: "HR",
    participants: 12,
    submissions: 19,
    likes: 387,
    engagement: 88
  },
  {
    rank: 3,
    department: "Operations",
    participants: 18,
    submissions: 22,
    likes: 341,
    engagement: 85
  },
  {
    rank: 4,
    department: "IT",
    participants: 14,
    submissions: 16,
    likes: 298,
    engagement: 82
  },
  {
    rank: 5,
    department: "Finance",
    participants: 10,
    submissions: 13,
    likes: 234,
    engagement: 78
  }
];

const individualLeaderboard = [
  {
    rank: 1,
    name: "Sarah Johnson",
    department: "HR",
    submissions: 5,
    likes: 234,
    badge: "Top Contributor"
  },
  {
    rank: 2,
    name: "Michael Chen",
    department: "Operations",
    submissions: 4,
    likes: 198,
    badge: "Rising Star"
  },
  {
    rank: 3,
    name: "Lisa Brown",
    department: "Marketing",
    submissions: 3,
    likes: 176,
    badge: "Creative Mind"
  },
  {
    rank: 4,
    name: "David Wilson",
    department: "IT",
    submissions: 4,
    likes: 165,
    badge: "Innovation Leader"
  },
  {
    rank: 5,
    name: "Emma Davis",
    department: "Finance",
    submissions: 3,
    likes: 142,
    badge: "Community Builder"
  }
];

const categoryLeaders = [
  {
    category: "Innovation",
    leader: "Tech Team Alpha",
    submissions: 8,
    likes: 298
  },
  {
    category: "Team Collaboration",
    leader: "HR Champions",
    submissions: 6,
    likes: 256
  },
  {
    category: "Sustainability",
    leader: "Green Initiative",
    submissions: 5,
    likes: 234
  },
  {
    category: "Customer Excellence",
    leader: "Service Stars",
    submissions: 7,
    likes: 198
  }
];

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-100 text-yellow-800";
      case 2: return "bg-gray-100 text-gray-800";
      case 3: return "bg-amber-100 text-amber-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Trophy className="h-6 w-6 mr-2" />
            Season 3 Leaderboard
          </CardTitle>
          <p className="text-purple-100">
            Celebrating participation, creativity, and community engagement
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Across 8 departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+18 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Above target</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="individuals">Individuals</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Participation Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentLeaderboard.map((dept) => (
                  <div key={dept.rank} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(dept.rank)}
                        <Badge className={getRankBadge(dept.rank)}>
                          #{dept.rank}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{dept.department}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{dept.participants} participants</span>
                          <span>•</span>
                          <span>{dept.submissions} submissions</span>
                          <span>•</span>
                          <span>{dept.likes} likes</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{dept.engagement}%</span>
                      </div>
                      <Progress value={dept.engagement} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individuals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Individual Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {individualLeaderboard.map((person) => (
                  <div key={person.rank} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(person.rank)}
                        <Badge className={getRankBadge(person.rank)}>
                          #{person.rank}
                        </Badge>
                      </div>
                      
                      <Avatar>
                        <AvatarFallback>
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{person.department}</span>
                          <span>•</span>
                          <span>{person.submissions} submissions</span>
                          <span>•</span>
                          <span>{person.likes} likes</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {person.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryLeaders.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{category.category}</h3>
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">Leading Team: {category.leader}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>{category.submissions} submissions</span>
                      <span className="font-medium">{category.likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}