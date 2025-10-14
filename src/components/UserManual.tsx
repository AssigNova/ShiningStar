import { Book, FileText, HelpCircle, Download, Video, Image, Upload, Users, Trophy, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function UserManual() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-100 to-purple-200 text-purple-900">
        <CardHeader className="mx-[0px] my-[18px]">
          <CardTitle className="text-2xl flex items-center">
            <Book className="h-6 w-6 mr-2" />
            User Manual & Handbook
          </CardTitle>
          <p className="text-blue-900">Everything you need to know about Shining Stars Season 3</p>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <Download className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Download PDF Guide</h3>
            <p className="text-sm text-gray-600 mb-4">Complete handbook in PDF format</p>
            <a target="_blank" href="https://cosmos-mumbai-bucket.s3.ap-south-1.amazonaws.com/Shining+Stars+User+Manual+R3.pdf">
              <Button size="sm" variant="outline">
                Download
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">Prize</h3>
            <p className="text-sm text-gray-600 mb-4">Prizes guides</p>
            <Button size="sm" variant="outline">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="submission-guide">Submissions</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Shining Stars Season 3</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Platform Overview</h3>
                <p className="text-gray-700 mb-4">
                  Shining Stars is ITC's premier employee engagement platform where teams and individuals showcase their achievements,
                  innovations, and collaborative efforts. Season 3 brings enhanced features for better community interaction and
                  recognition.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Getting Started Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 mt-1">1</Badge>
                    <div>
                      <h4 className="font-medium">Secure Login</h4>
                      <p className="text-sm text-gray-600">Use your ITC email credentials to access the platform</p>
                    </div>
                  </div>
                  {/* <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 mt-1">2</Badge>
                    <div>
                      <h4 className="font-medium">Complete Your Profile</h4>
                      <p className="text-sm text-gray-600">Add your department and role information</p>
                    </div>
                  </div> */}
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 mt-1">2</Badge>
                    <div>
                      <h4 className="font-medium">Explore Categories</h4>
                      <p className="text-sm text-gray-600">Browse different submission categories to understand themes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 mt-1">3</Badge>
                    <div>
                      <h4 className="font-medium">Create Your First Submission</h4>
                      <p className="text-sm text-gray-600">Share your story, innovation, or team achievement</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Key Features Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Upload className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">Easy file upload with drag & drop</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Team collaboration features</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">Department leaderboards</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Bell className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Real-time notifications</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  File Format Requirements
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Image className="h-4 w-4 mr-2 text-blue-600" />
                        Images
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Formats: JPEG, PNG, GIF</li>
                        <li>• Max size: 30MB</li>
                        <li>• Recommended: 1920x1080px</li>
                        <li>• High quality preferred</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Video className="h-4 w-4 mr-2 text-purple-600" />
                        Videos
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Formats: MP4, AVI, MOV</li>
                        <li>• Max size: 1GB</li>
                        <li>• Max duration: 2 minutes</li>
                        <li>• HD quality recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Submission Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Radiant 2025", desc: "Diwali Special, Show your creativity while you can!" },
                    { name: "Reel Stars", desc: "Capturing stories and creativity through short films by employees" },
                    { name: "Beats in Motion", desc: "Expressing rhythm, passion, and energy through dance" },
                    { name: "Harmony", desc: "Celebrating musical talent and soulful voices" },
                    { name: "Strokes of a Genius", desc: "Showcasing artistic brilliance through painting and creativity" },
                    {
                      name: "Through Your Lens (Photography)",
                      desc: "Capturing unique perspectives and visual storytelling through photography",
                    },
                    {
                      name: "Generations in Harmony (Family Group Performances)",
                      desc: "Bringing families together through collaborative performances",
                    },
                    {
                      name: "Teams in Unity (Group Performances by employees across departments or within departments)",
                      desc: "Fostering teamwork and creativity through group performances",
                    },
                  ].map((category) => (
                    <div key={category.name} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Participant Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge>Employee</Badge>
                    <span className="text-sm">ITC employees and team submissions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Spouse</Badge>
                    <span className="text-sm">Employee spouse participation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Child</Badge>
                    <span className="text-sm">Employee children's contributions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="dashboard">
                  <AccordionTrigger>Personal Dashboard</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Your personal dashboard provides:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Overview of all your submissions with status tracking</li>
                        <li>Engagement metrics (likes, comments, views)</li>
                        <li>Performance analytics and trends</li>
                        <li>Notification settings management</li>
                        <li>Draft management for incomplete submissions</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="leaderboard">
                  <AccordionTrigger>Leaderboards & Rankings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Track performance across multiple dimensions:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Department-wise participation rankings</li>
                        <li>Individual contributor leaderboards</li>
                        <li>Category-specific top performers</li>
                        <li>Real-time engagement metrics</li>
                        <li>Achievement badges and recognition</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="interaction">
                  <AccordionTrigger>Social Interaction</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Engage with the community through:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Like and comment on submissions</li>
                        <li>Internal shoutouts for recognition</li>
                        <li>Share submissions within the organization</li>
                        <li>Follow favorite contributors</li>
                        <li>Real-time notifications for interactions</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="search">
                  <AccordionTrigger>Search & Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Find content easily with:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Search by employee number or name</li>
                        <li>Filter by categories and departments</li>
                        <li>Sort by most loved, new submissions</li>
                        <li>Advanced filtering options</li>
                        <li>Personalized content recommendations</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="login-issues">
                  <AccordionTrigger>I can't log in with my ITC credentials</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>If you're having login issues:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Ensure you're using your complete ITC email address</li>
                        <li>Check if your password includes special characters</li>
                        <li>Try clearing your browser cache and cookies</li>
                        <li>Contact IT support if the issue persists</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="file-upload">
                  <AccordionTrigger>My file won't upload</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Common upload issues and solutions:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Check if your file size is under 10MB</li>
                        <li>Ensure the file format is supported (JPEG, PNG, GIF, MP4, AVI, MOV)</li>
                        <li>Try using a different browser</li>
                        <li>Check your internet connection stability</li>
                        <li>Use the drag & drop feature instead of browse</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="submission-status">
                  <AccordionTrigger>How long does approval take?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Submission review process:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Initial review: 24-48 hours</li>
                        <li>Content verification: 1-2 business days</li>
                        <li>Final approval: Up to 3 business days</li>
                        <li>You'll receive notifications at each stage</li>
                        <li>Check your dashboard for real-time status updates</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="draft-saving">
                  <AccordionTrigger>How do drafts work?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Draft functionality:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Save incomplete submissions as drafts</li>
                        <li>Drafts are automatically saved every 30 seconds</li>
                        <li>Access drafts from your personal dashboard</li>
                        <li>Edit and complete drafts anytime</li>
                        <li>Drafts don't count towards submission limits</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="support">
                  <AccordionTrigger>How do I get additional support?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Multiple support channels available:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Use the chatbot for instant assistance</li>
                        <li>Email support team at shiningstars@itc.in</li>
                        <li>Check this user manual for detailed guides</li>
                        <li>Watch video tutorials for step-by-step help</li>
                        <li>Contact your department coordinator</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
