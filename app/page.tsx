'use client';

import { useState, useEffect } from 'react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Navigation } from '@/components/Navigation';
import { SearchBar } from '@/components/SearchBar';
import { GroupCard } from '@/components/GroupCard';
import { StudySessionCard } from '@/components/StudySessionCard';
import { ResourceCard } from '@/components/ResourceCard';
import { ProjectCard } from '@/components/ProjectCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Plus, Star, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { type Group, type StudySession, type Resource, type Project } from '@/lib/types';
import { APP_CONFIG, MAJORS, INTERESTS } from '@/lib/constants';

// Mock data for demonstration
const mockGroups: Group[] = [
  {
    groupId: '1',
    name: 'Computer Science Study Group',
    description: 'Weekly study sessions for CS majors covering algorithms, data structures, and system design.',
    members: ['user1', 'user2', 'user3'],
    interests: ['Algorithms', 'Data Structures', 'System Design'],
    privacyLevel: 'public',
    createdBy: 'user1',
    createdAt: new Date(),
    memberCount: 24,
  },
  {
    groupId: '2',
    name: 'Business Administration Network',
    description: 'Connect with fellow business students for case studies, networking, and career development.',
    members: ['user4', 'user5'],
    interests: ['Networking', 'Case Studies', 'Career Development'],
    privacyLevel: 'public',
    createdBy: 'user4',
    createdAt: new Date(),
    memberCount: 18,
  },
  {
    groupId: '3',
    name: 'Machine Learning Research',
    description: 'Advanced ML research group focusing on deep learning and AI applications.',
    members: ['user6'],
    interests: ['Machine Learning', 'Deep Learning', 'Research'],
    privacyLevel: 'private',
    createdBy: 'user6',
    createdAt: new Date(),
    memberCount: 12,
  },
];

const mockSessions: StudySession[] = [
  {
    sessionId: '1',
    groupId: '1',
    title: 'Algorithm Design Workshop',
    description: 'Deep dive into dynamic programming and graph algorithms',
    dateTime: new Date(Date.now() + 86400000), // Tomorrow
    location: 'Library Room 204',
    attendees: ['user1', 'user2'],
    maxAttendees: 15,
    createdBy: 'user1',
    status: 'upcoming',
  },
  {
    sessionId: '2',
    groupId: '2',
    title: 'Case Study Analysis',
    description: 'Harvard Business School case study discussion',
    dateTime: new Date(Date.now() + 172800000), // Day after tomorrow
    location: 'Business Building 301',
    attendees: ['user4'],
    createdBy: 'user4',
    status: 'upcoming',
  },
];

const mockResources: Resource[] = [
  {
    resourceId: '1',
    groupId: '1',
    uploadedBy: 'user1',
    fileName: 'Algorithms_Cheat_Sheet.pdf',
    storageHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
    tags: {
      course: 'CS 401',
      professor: 'Dr. Smith',
      topic: 'Algorithms',
    },
    description: 'Comprehensive cheat sheet covering all major algorithms',
    uploadTimestamp: new Date(Date.now() - 86400000),
    downloadCount: 45,
  },
  {
    resourceId: '2',
    groupId: '2',
    uploadedBy: 'user4',
    fileName: 'Marketing_Strategy_Notes.docx',
    storageHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
    tags: {
      course: 'BUS 301',
      professor: 'Prof. Johnson',
      topic: 'Marketing',
    },
    description: 'Detailed notes from marketing strategy lectures',
    uploadTimestamp: new Date(Date.now() - 172800000),
    downloadCount: 23,
  },
];

const mockProjects: Project[] = [
  {
    projectId: '1',
    title: 'Campus Food Delivery App',
    description: 'Building a React Native app for on-campus food delivery with real-time tracking',
    requiredSkills: ['React Native', 'Node.js', 'MongoDB'],
    createdBy: 'user1',
    collaborators: ['user2'],
    status: 'open',
    deadline: new Date(Date.now() + 2592000000), // 30 days
    category: 'hackathon',
  },
  {
    projectId: '2',
    title: 'Sustainability Research Project',
    description: 'Analyzing campus energy consumption patterns and proposing green solutions',
    requiredSkills: ['Data Analysis', 'Research', 'Python'],
    createdBy: 'user6',
    collaborators: [],
    status: 'open',
    category: 'research',
  },
];

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<'group' | 'session' | 'project'>('group');
  
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };
  
  const handleCreateNew = (type: 'group' | 'session' | 'project') => {
    setCreateType(type);
    setIsCreateModalOpen(true);
  };
  
  const renderHomeContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="text-center">
        <h1 className="text-display text-white mb-2">{APP_CONFIG.name}</h1>
        <p className="text-body text-white text-opacity-80 mb-6">{APP_CONFIG.tagline}</p>
        
        <Wallet>
          <ConnectWallet>
            <div className="flex items-center space-x-2">
              <Avatar size="sm" />
              <Name />
            </div>
          </ConnectWallet>
        </Wallet>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-300" />
          <div className="text-heading text-white">{mockGroups.length}</div>
          <div className="text-caption">Active Groups</div>
        </Card>
        
        <Card className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-green-300" />
          <div className="text-heading text-white">{mockSessions.length}</div>
          <div className="text-caption">Study Sessions</div>
        </Card>
        
        <Card className="text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-300" />
          <div className="text-heading text-white">{mockResources.length}</div>
          <div className="text-caption">Resources</div>
        </Card>
        
        <Card className="text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
          <div className="text-heading text-white">{mockProjects.length}</div>
          <div className="text-caption">Projects</div>
        </Card>
      </div>
      
      {/* Featured Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading text-white">Featured Groups</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('groups')}
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockGroups.slice(0, 3).map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              onJoin={(id) => console.log('Join group:', id)}
              onView={(id) => console.log('View group:', id)}
            />
          ))}
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading text-white">Upcoming Sessions</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCreateNew('session')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockSessions.map((session) => (
            <StudySessionCard
              key={session.sessionId}
              session={session}
              onJoin={(id) => console.log('Join session:', id)}
              onView={(id) => console.log('View session:', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderGroupsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display text-white">Study Groups</h2>
        <Button
          variant="primary"
          onClick={() => handleCreateNew('group')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>
      
      <SearchBar
        placeholder="Search groups by name, major, or interests..."
        onSearch={handleSearch}
        onFilter={() => console.log('Open filters')}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGroups.map((group) => (
          <GroupCard
            key={group.groupId}
            group={group}
            onJoin={(id) => console.log('Join group:', id)}
            onView={(id) => console.log('View group:', id)}
          />
        ))}
      </div>
    </div>
  );
  
  const renderResourcesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display text-white">Academic Resources</h2>
        <Button
          variant="primary"
          onClick={() => console.log('Upload resource')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>
      
      <SearchBar
        placeholder="Search resources by course, professor, or topic..."
        onSearch={handleSearch}
        onFilter={() => console.log('Open filters')}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResources.map((resource) => (
          <ResourceCard
            key={resource.resourceId}
            resource={resource}
            onDownload={(id) => console.log('Download resource:', id)}
            onView={(id) => console.log('View resource:', id)}
          />
        ))}
      </div>
    </div>
  );
  
  const renderProjectsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display text-white">Collaborative Projects</h2>
        <Button
          variant="primary"
          onClick={() => handleCreateNew('project')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>
      
      <SearchBar
        placeholder="Search projects by skills, category, or keywords..."
        onSearch={handleSearch}
        onFilter={() => console.log('Open filters')}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <ProjectCard
            key={project.projectId}
            project={project}
            onJoin={(id) => console.log('Join project:', id)}
            onView={(id) => console.log('View project:', id)}
          />
        ))}
      </div>
    </div>
  );
  
  const renderProfileContent = () => (
    <div className="space-y-6">
      <Card className="text-center">
        <Avatar size="lg" fallback="You" className="mx-auto mb-4" />
        <h2 className="text-heading text-white mb-2">Your Profile</h2>
        <p className="text-caption mb-4">Complete your profile to connect with like-minded students</p>
        
        <div className="space-y-4">
          <Input placeholder="Display Name" />
          <select className="input-field w-full">
            <option value="">Select Major</option>
            {MAJORS.map((major) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
          <Input placeholder="Bio (optional)" />
        </div>
        
        <Button variant="primary" className="mt-6">
          Save Profile
        </Button>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-heading text-white mb-4">Your Groups</h3>
          <p className="text-caption">You haven't joined any groups yet.</p>
        </Card>
        
        <Card>
          <h3 className="text-heading text-white mb-4">Your Projects</h3>
          <p className="text-caption">No active projects.</p>
        </Card>
      </div>
    </div>
  );
  
  const renderCreateModal = () => (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      title={`Create New ${createType.charAt(0).toUpperCase() + createType.slice(1)}`}
    >
      <div className="space-y-4">
        <Input placeholder={`${createType.charAt(0).toUpperCase() + createType.slice(1)} Name`} />
        <textarea
          placeholder="Description"
          className="input-field w-full h-24 resize-none"
        />
        
        {createType === 'group' && (
          <>
            <select className="input-field w-full">
              <option value="public">Public Group</option>
              <option value="private">Private Group</option>
            </select>
            <Input placeholder="Add interests (comma separated)" />
          </>
        )}
        
        {createType === 'session' && (
          <>
            <Input type="datetime-local" />
            <Input placeholder="Location or Virtual Link" />
            <Input type="number" placeholder="Max Attendees (optional)" />
          </>
        )}
        
        {createType === 'project' && (
          <>
            <select className="input-field w-full">
              <option value="hackathon">Hackathon</option>
              <option value="coursework">Coursework</option>
              <option value="research">Research</option>
              <option value="extracurricular">Extracurricular</option>
            </select>
            <Input placeholder="Required Skills (comma separated)" />
            <Input type="date" placeholder="Deadline (optional)" />
          </>
        )}
        
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log(`Create ${createType}`);
              setIsCreateModalOpen(false);
            }}
            className="flex-1"
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'groups':
        return renderGroupsContent();
      case 'resources':
        return renderResourcesContent();
      case 'projects':
        return renderProjectsContent();
      case 'profile':
        return renderProfileContent();
      default:
        return renderHomeContent();
    }
  };
  
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <main className="animate-fade-in">
          {renderContent()}
        </main>
        
        {/* Modals */}
        {renderCreateModal()}
      </div>
    </div>
  );
}
