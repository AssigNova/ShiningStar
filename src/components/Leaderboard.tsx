import { Trophy, Medal, Award, TrendingUp, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useEffect, useState } from "react";

// Define types for the data structures
interface DepartmentStats {
  participants?: number;
  submissions?: number;
  engagement?: number;
  [key: string]: unknown; // For other properties we might not use
}

export function Leaderboard() {
  const [stats, setStats] = useState({
    participants: 0,
    departments: 0,
    submissions: 0,
    submissionsThisWeek: 0,
    engagement: 0,
  });
  const [departmentLeaderboard, setDepartmentLeaderboard] = useState<any[]>([]);
  const [individualLeaderboard, setIndividualLeaderboard] = useState<any[]>([]);
  const [categoryLeaders, setCategoryLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard/departments")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({
          ...prev,
          departments: data.length,
          participants: data.reduce((sum: number, d: DepartmentStats) => sum + (d.participants || 0), 0),
          submissions: data.reduce((sum: number, d: DepartmentStats) => sum + (d.submissions || 0), 0),
          engagement: Math.round(data.reduce((sum: number, d: DepartmentStats) => sum + (d.engagement || 0), 0) / (data.length || 1)),
        }));
      });
    fetch("/api/leaderboard/submissionsThisWeek")
      .then((res) => res.json())
      .then((data) => setStats((prev) => ({ ...prev, submissionsThisWeek: data.count })));
  }, []);

  useEffect(() => {
    fetch("/api/leaderboard/departments")
      .then((res) => res.json())
      .then((data) => setDepartmentLeaderboard(data));
    fetch("/api/leaderboard/individuals")
      .then((res) => res.json())
      .then((data) => setIndividualLeaderboard(data));
    fetch("/api/leaderboard/categories")
      .then((res) => res.json())
      .then((data) => setCategoryLeaders(data));
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      case 3:
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-200 text-purple-900">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl flex items-center">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Season 3 Leaderboard
          </CardTitle>
          <p className="text-purple9100 text-sm sm:text-base">Celebrating participation, creativity, and community engagement</p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">{stats.participants}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Across {stats.departments} departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.submissions}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+{stats.submissionsThisWeek} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{stats.engagement}%</p>
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
          <TabsTrigger value="departments" className="text-xs sm:text-sm">
            Departments
          </TabsTrigger>
          <TabsTrigger value="individuals" className="text-xs sm:text-sm">
            Individuals
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs sm:text-sm">
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Department Participation Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {departmentLeaderboard.map((dept) => (
                  <div
                    key={dept.rank}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4 sm:gap-0">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(dept.rank)}
                        <Badge className={getRankBadge(dept.rank)}>#{dept.rank}</Badge>
                      </div>

                      <div className="flex-1 sm:flex-none">
                        <h3 className="font-semibold text-sm sm:text-base">{dept.department}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1">
                          <span>{dept.participants} participants</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{dept.submissions} submissions</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{dept.likes} likes</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm sm:text-base">{dept.engagement}%</span>
                      </div>
                      <Progress value={dept.engagement} className="w-full sm:w-24 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individuals" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Top Individual Contributors</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {individualLeaderboard.map((person) => (
                  <div
                    key={person.rank}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4 sm:gap-0">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(person.rank)}
                        <Badge className={getRankBadge(person.rank)}>#{person.rank}</Badge>
                      </div>

                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarFallback className="text-xs sm:text-sm">
                          {person.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 sm:flex-none">
                        <h3 className="font-semibold text-sm sm:text-base">{person.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1">
                          <span>{person.department}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{person.submissions} submissions</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{person.likes} likes</span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 text-xs sm:text-sm self-start sm:self-auto mt-2 sm:mt-0">
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
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Category Leaders</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryLeaders.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{category.category}</h3>
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Leading Team: {category.leader}</p>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
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
