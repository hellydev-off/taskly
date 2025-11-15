import "reflect-metadata";
import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";
import { Project } from "../entities/Project.js";
import { Task } from "../entities/Task.js";
import { Section } from "../entities/Section.js";
import bcrypt from "bcrypt";

async function seed() {
  try {
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);
    const projectRepo = AppDataSource.getRepository(Project);
    const taskRepo = AppDataSource.getRepository(Task);
    const sectionRepo = AppDataSource.getRepository(Section);

    let user = await userRepo.findOne({
      where: { email: "teamlead@mail.ru" },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash("123123", 10);
      user = userRepo.create({
        email: "teamlead@example.com",
        username: "teamLead",
        password: hashedPassword,
      });
      await userRepo.save(user);
    }

    const projectsData = [
      {
        name: "Работа",
        description: "Рекрутмент и отбор кандидатов",
        color: "#EF4444",
        viewType: "list" as const,
      },
      {
        name: "Будни",
        description: "Повседневные дела и привычки",
        color: "#8B5CF6",
        viewType: "list" as const,
      },
      {
        name: "Проекты",
        description: "Актуальные проекты команды",
        color: "#06B6D4",
        viewType: "board" as const,
      },
    ];

    const projects: Project[] = [];

    for (const data of projectsData) {
      let project = await projectRepo.findOne({
        where: { name: data.name, owner: { id: user.id } },
      });

      if (!project) {
        project = projectRepo.create({
          ...data,
          owner: user,
        });
        await projectRepo.save(project);
      }

      projects.push(project);
    }

    const projectsProject = projects.find((p) => p.viewType === "board");
    const sections: Section[] = [];

    if (projectsProject) {
      const sectionsData = [
        { name: "Backlog", order: 0 },
        { name: "In Progress", order: 1 },
        { name: "Review", order: 2 },
        { name: "Done", order: 3 },
      ];

      for (const data of sectionsData) {
        let section = await sectionRepo.findOne({
          where: { name: data.name, project: { id: projectsProject.id } },
        });

        if (!section) {
          section = sectionRepo.create({
            ...data,
            project: projectsProject,
          });
          await sectionRepo.save(section);
        }

        sections.push(section);
      }
    }

    const tasksData = [
      {
        title: "Посмотреть тестовое",
        description: "Просмотреть решение от кандидата Максима",
        priority: "high" as const,
        status: "в_процессе" as const,
        tags: ["recruitment", "test"],
        projectIndex: 0,
        sectionIndex: null,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Оценить тестовое",
        description: "Дать оценку на решение кандидата Максима",
        priority: "high" as const,
        status: "в_процессе" as const,
        tags: ["recruitment", "evaluation"],
        projectIndex: 0,
        sectionIndex: null,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Выслать офер Максиму",
        description: "Отправить offer letter кандидату Максиму",
        priority: "high" as const,
        status: "в_процессе" as const,
        tags: ["recruitment", "offer"],
        projectIndex: 0,
        sectionIndex: null,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Выпить кофе",
        description: "Утренний кофе с коллегой в офисе",
        priority: "low" as const,
        status: "в_процессе" as const,
        tags: ["привычки", "социальное"],
        projectIndex: 1,
        sectionIndex: null,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Прогулка по парку",
        description: "30-минутная прогулка на свежем воздухе",
        priority: "medium" as const,
        status: "в_процессе" as const,
        tags: ["здоровье", "спорт"],
        projectIndex: 1,
        sectionIndex: null,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Обеденный перерыв",
        description: "Обед + отдых в 12:00",
        priority: "low" as const,
        status: "завершено" as const,
        tags: ["привычки"],
        projectIndex: 1,
        sectionIndex: null,
        completedAt: new Date(),
      },
      {
        title: "Ответить на письма",
        description: "Ответить на накопившуюся почту",
        priority: "medium" as const,
        status: "в_процессе" as const,
        tags: ["работа", "коммуникация"],
        projectIndex: 1,
        sectionIndex: null,
      },
      {
        title: "Зарядка",
        description: "10 минут утренней зарядки",
        priority: "low" as const,
        status: "завершено" as const,
        tags: ["здоровье", "спорт"],
        projectIndex: 1,
        sectionIndex: null,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        title: "Redux state management",
        description: "Мигрировать с Context API на Redux",
        priority: "high" as const,
        status: "в_процессе" as const,
        tags: ["frontend", "state"],
        projectIndex: 2,
        sectionIndex: 1,
      },
      {
        title: "Optimize bundle size",
        description: "Уменьшить размер js бандла",
        priority: "medium" as const,
        status: "в_процессе" as const,
        tags: ["frontend", "performance"],
        projectIndex: 2,
        sectionIndex: 1,
      },
      {
        title: "Add E2E tests",
        description: "Написать E2E тесты на Cypress",
        priority: "medium" as const,
        status: "в_процессе" as const,
        tags: ["qa", "testing"],
        projectIndex: 2,
        sectionIndex: 2,
      },
      {
        title: "Fix critical bugs from production",
        description: "Исправить критические баги в продакшене",
        priority: "high" as const,
        status: "завершено" as const,
        tags: ["bug", "critical"],
        projectIndex: 2,
        sectionIndex: 3,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Database migration to PostgreSQL",
        description: "Перенести данные на PostgreSQL",
        priority: "high" as const,
        status: "в_процессе" as const,
        tags: ["backend", "database"],
        projectIndex: 2,
        sectionIndex: 0,
      },
      {
        title: "API rate limiting",
        description: "Добавить rate limiting для API",
        priority: "medium" as const,
        status: "в_процессе" as const,
        tags: ["backend", "security"],
        projectIndex: 2,
        sectionIndex: 0,
      },
    ];

    for (const data of tasksData) {
      const project = projects[data.projectIndex];
      const section =
        data.sectionIndex !== null ? sections[data.sectionIndex] : null;

      let task = await taskRepo.findOne({
        where: {
          title: data.title,
          project: { id: project.id },
          user: { id: user.id },
        },
      });

      if (!task) {
        task = taskRepo.create({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          tags: data.tags,
          project: project,
          section: section,
          user: user,
          dueDate: (data as any).dueDate || null,
          completedAt: (data as any).completedAt || null,
        });
        await taskRepo.save(task);
      }
    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

seed();
