"use client";

//write all components in shadcn
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X, Copy, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const companies = [
  "ByteDance",
  "Tencent",
  "Alibaba",
  "Baidu",
  "Meituan",
  "Pinduoduo",
  "JD.com",
  "NetEase",
  "Xiaomi",
  "Huawei",
  "Other"
];

const recruiterPositions = [
  "HR Manager",
  "Technical Recruiter",
  "Talent Acquisition Specialist",
  "HR Business Partner",
  "Recruitment Manager",
  "Other"
];

const jobPositions = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Other"
];

const skills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "AWS",
  "Docker",
  "Kubernetes",
  "SQL",
  "MongoDB",
  "GraphQL",
  "REST API",
  "CI/CD",
  "Git",
  "Agile",
  "System Design",
  "Microservices",
  "Cloud Architecture",
  "Machine Learning"
];

interface InfoFormProps {
  onSubmit?: (data: { persona: string; target: string }) => void;
}

export default function InfoForm({ onSubmit }: InfoFormProps) {
  // Persona form states
  const [company, setCompany] = useState("");
  const [recruiterPosition, setRecruiterPosition] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Target form states
  const [jobPosition, setJobPosition] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Message states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const persona = `${company} - ${recruiterPosition} - ${additionalInfo}`;
    const target = `${jobPosition} - ${description} - Required Skills: ${selectedSkills.join(", ")}`;

    if (onSubmit) {
      onSubmit({ persona, target });
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, target }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate message");
      }

      const data = await res.json();
      setMessage(data.message || "Error generating message.");
    } catch (error) {
      setError("Failed to generate message. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!message) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        setError("Failed to copy to clipboard. Please try again.");
      }
    } else {
      setError("Clipboard API is not available in your browser.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Generate Your Message</h1>
        <p className="text-muted-foreground">Tell us about yourself and the job you're hiring for</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Persona Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">About You</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Which company are you from?<span className="text-red-500">*</span>
            </label>
            <Select value={company} onValueChange={setCompany} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              What is your job position?<span className="text-red-500">*</span>
            </label>
            <Select value={recruiterPosition} onValueChange={setRecruiterPosition} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your position" />
              </SelectTrigger>
              <SelectContent>
                {recruiterPositions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Anything more you want to tell us?
            </label>
            <Textarea
              value={additionalInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdditionalInfo(e.target.value)}
              placeholder="Share any additional information about yourself or your company..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Target Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">About The Job</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Job Title<span className="text-red-500">*</span>
            </label>
            <Select value={jobPosition} onValueChange={setJobPosition} required>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {jobPositions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Job description<span className="text-red-500">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe the role and responsibilities..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Required skills<span className="text-red-500">*</span>
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  Select skills
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search skills..." />
                  <CommandEmpty>No skill found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {skills.map((skill) => (
                      <CommandItem
                        key={skill}
                        onSelect={() => {
                          setSelectedSkills((prev) =>
                            prev.includes(skill)
                              ? prev.filter((s) => s !== skill)
                              : [...prev, skill]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSkills.includes(skill) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedSkills((prev) => prev.filter((s) => s !== skill))}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={!company || !recruiterPosition || !jobPosition || !description || selectedSkills.length === 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Message"
          )}
        </Button>
      </form>

      {/* Message Display Section */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Generating your message...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {message && !loading && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap border border-gray-200">
            {message}
          </div>

          <Button
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
      )}
    </div>
  );
} 