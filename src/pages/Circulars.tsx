import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Users, Bell, Download, Eye, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Circular {
    id: string;
    title: string;
    description: string;
    date: string;
    category: 'principal' | 'hod' | 'common';
    isNew?: boolean;
    priority?: 'high' | 'medium' | 'low';
}

interface CircularsCardProps {
    circulars?: Circular[];
    className?: string;
    onView: (circular: Circular) => void;
    onDownload: (circular: Circular) => void;
}

const defaultCirculars: Circular[] = [
    {
        id: '1',
        title: 'Annual Academic Calendar 2024-25',
        description: 'Important dates and events for the upcoming academic year including examination schedules and holidays.',
        date: '2024-01-15',
        category: 'principal',
        isNew: true,
        priority: 'high',
    },
    {
        id: '2',
        title: 'Department Meeting - Computer Science',
        description: 'Monthly departmental meeting to discuss curriculum updates and student performance.',
        date: '2024-01-10',
        category: 'hod',
        priority: 'medium',
    },
    {
        id: '3',
        title: 'Library Hours Extension',
        description: 'Library will remain open until 10 PM during examination period.',
        date: '2024-01-08',
        category: 'common',
        isNew: true,
        priority: 'low',
    },
    {
        id: '4',
        title: 'Faculty Development Program',
        description: 'Workshop on modern teaching methodologies and digital tools for educators.',
        date: '2024-01-05',
        category: 'principal',
        priority: 'medium',
    },
    {
        id: '5',
        title: 'Research Paper Submission Guidelines',
        description: 'Updated guidelines for faculty members submitting research papers for publication.',
        date: '2024-01-03',
        category: 'hod',
        priority: 'high',
    },
    {
        id: '6',
        title: 'Campus Maintenance Notice',
        description: 'Scheduled maintenance work in academic blocks during weekend.',
        date: '2024-01-01',
        category: 'common',
        priority: 'low',
    },
];

const categoryConfig = {
    principal: {
        icon: Bell,
        label: 'Principal',
        color: 'bg-blue-500',
        badgeVariant: 'default' as const,
    },
    hod: {
        icon: Users,
        label: 'HOD',
        color: 'bg-purple-500',
        badgeVariant: 'secondary' as const,
    },
    common: {
        icon: FileText,
        label: 'Common',
        color: 'bg-green-500',
        badgeVariant: 'outline' as const,
    },
};

const priorityColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600',
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const CircularsCard: React.FC<CircularsCardProps> = ({
    circulars = defaultCirculars,
    className,
    onView,
    onDownload
}) => {
    const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'principal' | 'hod' | 'common'>('all');

    const filteredCirculars = selectedCategory === 'all'
        ? circulars
        : circulars.filter(c => c.category === selectedCategory);

    const groupedCirculars = {
        principal: circulars.filter(c => c.category === 'principal'),
        hod: circulars.filter(c => c.category === 'hod'),
        common: circulars.filter(c => c.category === 'common'),
    };

    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        selectedCategory === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                >
                    All Circulars
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key as 'principal' | 'hod' | 'common')}
                        className={cn(
                            'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                            selectedCategory === key
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        )}
                    >
                        <config.icon className="h-4 w-4" />
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Circulars Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredCirculars.map((circular) => {
                    const config = categoryConfig[circular.category];
                    const Icon = config.icon;

                    return (
                        <motion.div key={circular.id} variants={itemVariants}>
                            <Card
                                className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                                onClick={() => onView(circular)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={cn('p-2 rounded-lg', config.color, 'bg-opacity-10')}>
                                            <Icon className={cn('h-5 w-5', config.color.replace('bg-', 'text-'))} />
                                        </div>
                                        <div className="flex gap-2">
                                            {circular.isNew && (
                                                <Badge variant="default" className="text-xs">
                                                    New
                                                </Badge>
                                            )}
                                            {circular.priority && (
                                                <Badge
                                                    variant="outline"
                                                    className={cn('text-xs', priorityColors[circular.priority])}
                                                >
                                                    {circular.priority}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                        {circular.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {new Date(circular.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {circular.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <Badge variant={config.badgeVariant} className="text-xs">
                                            {config.label}
                                        </Badge>
                                        <span className="text-xs text-primary group-hover:underline">
                                            Read more →
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {filteredCirculars.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No circulars found in this category.</p>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {Object.entries(groupedCirculars).map(([category, items]) => {
                    const config = categoryConfig[category as keyof typeof categoryConfig];
                    const Icon = config.icon;

                    return (
                        <Card key={category} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={cn('p-2 rounded-lg', config.color, 'bg-opacity-10')}>
                                        <Icon className={cn('h-5 w-5', config.color.replace('bg-', 'text-'))} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{config.label}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {items.length} circular{items.length !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">{items.length}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

// Variant 2: Timeline View
const CircularsTimelineView: React.FC<CircularsCardProps> = ({
    circulars = defaultCirculars,
    className,
    onView,
    onDownload
}) => {
    const sortedCirculars = [...circulars].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className={cn('w-full', className)}>
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-8">
                    {sortedCirculars.map((circular, index) => {
                        const config = categoryConfig[circular.category];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={circular.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-20"
                            >
                                {/* Timeline dot */}
                                <div className={cn(
                                    'absolute left-6 w-5 h-5 rounded-full border-4 border-background',
                                    config.color
                                )} />

                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn('p-2 rounded-lg', config.color, 'bg-opacity-10')}>
                                                    <Icon className={cn('h-5 w-5', config.color.replace('bg-', 'text-'))} />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{circular.title}</CardTitle>
                                                    <CardDescription className="text-sm">
                                                        {new Date(circular.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {circular.isNew && <Badge variant="default">New</Badge>}
                                                {circular.priority && (
                                                    <Badge variant="outline" className={priorityColors[circular.priority]}>
                                                        {circular.priority}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {circular.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Badge variant={config.badgeVariant}>{config.label}</Badge>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => onView(circular)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => onDownload(circular)}>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function CircularsPage() {
    const [view, setView] = React.useState<'grid' | 'timeline'>('grid');
    const [selectedCircular, setSelectedCircular] = React.useState<Circular | null>(null);

    const handleView = (circular: Circular) => {
        setSelectedCircular(circular);
    };

    const handleDownload = (circular: Circular) => {
        toast.success(`Downloading ${circular.title}...`, {
            description: "The file download has started."
        });
        // In a real app, you would trigger a file download here
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">Circulars</h1>
                            <p className="text-muted-foreground">
                                Stay updated with the latest announcements and notifications
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={view === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setView('grid')}
                            >
                                Grid View
                            </Button>
                            <Button
                                variant={view === 'timeline' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setView('timeline')}
                            >
                                Timeline
                            </Button>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'grid' && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <CircularsCard
                                onView={handleView}
                                onDownload={handleDownload}
                            />
                        </motion.div>
                    )}
                    {view === 'timeline' && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <CircularsTimelineView
                                onView={handleView}
                                onDownload={handleDownload}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Dialog */}
                <Dialog open={!!selectedCircular} onOpenChange={(open) => !open && setSelectedCircular(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{selectedCircular?.title}</DialogTitle>
                            <DialogDescription>
                                {selectedCircular && new Date(selectedCircular.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedCircular && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Badge variant={categoryConfig[selectedCircular.category].badgeVariant}>
                                        {categoryConfig[selectedCircular.category].label}
                                    </Badge>
                                    {selectedCircular.priority && (
                                        <Badge variant="outline" className={priorityColors[selectedCircular.priority]}>
                                            {selectedCircular.priority} Priority
                                        </Badge>
                                    )}
                                </div>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedCircular.description}
                                        {/* Adding dummy content to make it look like a full circular */}
                                        <br /><br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="sm:justify-between gap-2">
                            <Button variant="ghost" onClick={() => setSelectedCircular(null)}>
                                Close
                            </Button>
                            {selectedCircular && (
                                <Button onClick={() => handleDownload(selectedCircular)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
