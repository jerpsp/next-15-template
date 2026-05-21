"use client"

import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined"
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import { useSession } from "next-auth/react"
import { usePosts } from "@/tanstack/query/hooks/Post/usePosts"
import { useCategories } from "@/tanstack/query/hooks/Category/useCategories"
import { useMedia } from "@/tanstack/query/hooks/Media/useMedia"

const STATUS_COLOR: Record<string, "default" | "success" | "warning" | "error"> = {
  published: "success",
  draft: "warning",
  archived: "default",
}

function StatCard({
  label,
  value,
  icon,
  loading,
}: {
  label: string
  value: number | undefined
  icon: React.ReactNode
  loading: boolean
}) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
          >
            {label}
          </Typography>
          <Box sx={{ color: "text.secondary" }}>{icon}</Box>
        </Box>
        {loading ? (
          <Skeleton variant="text" width={48} height={40} />
        ) : (
          <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1 }}>
            {value ?? 0}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardView() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const email = session?.user?.email ?? ""

  const { data: postsData, isLoading: postsLoading } = usePosts({ page: 1, limit: 100 })
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ page: 1, limit: 100 })
  const { data: mediaData, isLoading: mediaLoading } = useMedia()

  const posts = postsData?.posts ?? []
  const publishedCount = posts.filter((p) => p.status === "published").length
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: "Total Posts",
      value: postsData?.total,
      icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />,
      loading: postsLoading,
    },
    {
      label: "Published",
      value: publishedCount,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />,
      loading: postsLoading,
    },
    {
      label: "Categories",
      value: categoriesData?.total,
      icon: <CategoryOutlinedIcon sx={{ fontSize: 20 }} />,
      loading: categoriesLoading,
    },
    {
      label: "Media Files",
      value: mediaData?.total,
      icon: <PermMediaOutlinedIcon sx={{ fontSize: 20 }} />,
      loading: mediaLoading,
    },
  ]

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      {/* Greeting */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome back{email ? `, ${email.split("@")[0]}` : ""} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You are signed in as{" "}
          <Chip
            label={role}
            size="small"
            sx={{ height: 18, fontSize: "0.7rem", fontWeight: 600, verticalAlign: "middle" }}
          />
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent posts */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Recent Posts
          </Typography>
        </Box>
        <Divider sx={{ mb: 0 }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                  Title
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {postsLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={64} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                    </TableRow>
                  ))
                : recentPosts.map((post) => (
                    <TableRow key={post.id} hover>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 480 }}>
                          {post.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={post.status}
                          size="small"
                          color={STATUS_COLOR[post.status] ?? "default"}
                          sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
