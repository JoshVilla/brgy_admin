"use client";
import Container from "@/components/container";
import TitlePage from "@/components/titlePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOfficials } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Plus, User, Edit, Crown, Shield, Users, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import withAuth from "@/lib/withAuth";

interface Official {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  position: string;
  committee?: string;
  contactNumber: string;
  photo?: string;
  status: string;
}

const OfficialCard = ({ official }: { official: Official }) => {
  const router = useRouter();
  const fullName = `${official.firstName} ${
    official.middleName ? official.middleName + " " : ""
  }${official.lastName}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Photo */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {official.photo ? (
              <Image
                src={official.photo}
                alt={fullName}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{fullName}</h3>
            <p className="text-xs text-gray-600">{official.position}</p>
            {official.committee && (
              <p className="text-xs text-gray-500">{official.committee}</p>
            )}
          </div>

          {/* Contact & Status */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  router.push(`/admin/officials/editOfficial/${official._id}`)
                }
              >
                <Edit className="w-3.5 h-3.5 text-gray-500" />
              </Button>
              <Badge
                variant={official.status === "Active" ? "default" : "secondary"}
                className="text-xs"
              >
                {official.status}
              </Badge>
            </div>
            <span className="text-xs text-gray-500">
              {official.contactNumber}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  count,
  color,
}: {
  icon: any;
  title: string;
  count?: number;
  color: string;
}) => (
  <div className="flex items-center gap-3 mb-3">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <h2 className="text-sm font-semibold text-gray-700">
      {title}
      {count !== undefined && (
        <span className="text-gray-500 ml-1">({count})</span>
      )}
    </h2>
  </div>
);

const Page = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["officials"],
    queryFn: () => getOfficials({}),
  });

  if (isLoading) {
    return (
      <Container>
        <TitlePage title="Barangay Officials" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      </Container>
    );
  }

  const officials = data?.data || [];

  // Group officials by position
  const captain = officials.find((o: Official) => o.position === "Captain");
  const secretary = officials.find((o: Official) => o.position === "Secretary");
  const treasurer = officials.find((o: Official) => o.position === "Treasurer");
  const kagawads = officials.filter((o: Official) => o.position === "Kagawad");
  const skChairman = officials.find(
    (o: Official) => o.position === "SK Chairman"
  );
  const skKagawads = officials.filter(
    (o: Official) => o.position === "SK Kagawad"
  );
  const tanods = officials.filter((o: Official) => o.position === "Tanod");

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <TitlePage title="Barangay Officials" />
        <Button
          onClick={() => router.push("/admin/officials/addOfficial")}
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <div className="space-y-6">
        {/* Barangay Captain */}
        {captain && (
          <div>
            <SectionHeader
              icon={Crown}
              title="Barangay Captain"
              color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            />
            <OfficialCard official={captain} />
          </div>
        )}

        {/* Administrative Officials */}
        {(secretary || treasurer) && (
          <div>
            <SectionHeader
              icon={Shield}
              title="Administrative"
              count={(secretary ? 1 : 0) + (treasurer ? 1 : 0)}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {secretary && <OfficialCard official={secretary} />}
              {treasurer && <OfficialCard official={treasurer} />}
            </div>
          </div>
        )}

        {/* Barangay Council */}
        {kagawads.length > 0 && (
          <div>
            <SectionHeader
              icon={Users}
              title="Barangay Council"
              count={kagawads.length}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {kagawads.map((official: Official) => (
                <OfficialCard key={official._id} official={official} />
              ))}
            </div>
          </div>
        )}

        {/* Sangguniang Kabataan */}
        {(skChairman || skKagawads.length > 0) && (
          <div>
            <SectionHeader
              icon={Award}
              title="Sangguniang Kabataan"
              count={(skChairman ? 1 : 0) + skKagawads.length}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <div className="space-y-3">
              {skChairman && <OfficialCard official={skChairman} />}
              {skKagawads.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skKagawads.map((official: Official) => (
                    <OfficialCard key={official._id} official={official} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Barangay Tanod */}
        {tanods.length > 0 && (
          <div>
            <SectionHeader
              icon={Shield}
              title="Barangay Tanod"
              count={tanods.length}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {tanods.map((official: Official) => (
                <OfficialCard key={official._id} official={official} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {officials.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No officials yet</p>
              <Button
                onClick={() => router.push("/admin/officials/addOfficial")}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add Official
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default withAuth(Page);
