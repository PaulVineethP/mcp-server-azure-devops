"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitInterfaces_1 = require("azure-devops-node-api/interfaces/GitInterfaces");
const index_1 = require("./index");
describe('Enum Mappers', () => {
    describe('commentThreadStatusMapper', () => {
        it('should map string values to enum values correctly', () => {
            expect(index_1.commentThreadStatusMapper.toEnum('active')).toBe(GitInterfaces_1.CommentThreadStatus.Active);
            expect(index_1.commentThreadStatusMapper.toEnum('fixed')).toBe(GitInterfaces_1.CommentThreadStatus.Fixed);
            expect(index_1.commentThreadStatusMapper.toEnum('wontfix')).toBe(GitInterfaces_1.CommentThreadStatus.WontFix);
            expect(index_1.commentThreadStatusMapper.toEnum('closed')).toBe(GitInterfaces_1.CommentThreadStatus.Closed);
            expect(index_1.commentThreadStatusMapper.toEnum('bydesign')).toBe(GitInterfaces_1.CommentThreadStatus.ByDesign);
            expect(index_1.commentThreadStatusMapper.toEnum('pending')).toBe(GitInterfaces_1.CommentThreadStatus.Pending);
            expect(index_1.commentThreadStatusMapper.toEnum('unknown')).toBe(GitInterfaces_1.CommentThreadStatus.Unknown);
        });
        it('should map enum values to string values correctly', () => {
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.Active)).toBe('active');
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.Fixed)).toBe('fixed');
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.WontFix)).toBe('wontfix');
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.Closed)).toBe('closed');
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.ByDesign)).toBe('bydesign');
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.Pending)).toBe('pending');
            expect(index_1.commentThreadStatusMapper.toString(GitInterfaces_1.CommentThreadStatus.Unknown)).toBe('unknown');
        });
        it('should handle case insensitive string input', () => {
            expect(index_1.commentThreadStatusMapper.toEnum('ACTIVE')).toBe(GitInterfaces_1.CommentThreadStatus.Active);
            expect(index_1.commentThreadStatusMapper.toEnum('Active')).toBe(GitInterfaces_1.CommentThreadStatus.Active);
        });
        it('should return undefined for invalid string values', () => {
            expect(index_1.commentThreadStatusMapper.toEnum('invalid')).toBeUndefined();
        });
        it('should return default value for invalid enum values', () => {
            expect(index_1.commentThreadStatusMapper.toString(999)).toBe('unknown');
        });
    });
    describe('commentTypeMapper', () => {
        it('should map string values to enum values correctly', () => {
            expect(index_1.commentTypeMapper.toEnum('text')).toBe(GitInterfaces_1.CommentType.Text);
            expect(index_1.commentTypeMapper.toEnum('codechange')).toBe(GitInterfaces_1.CommentType.CodeChange);
            expect(index_1.commentTypeMapper.toEnum('system')).toBe(GitInterfaces_1.CommentType.System);
            expect(index_1.commentTypeMapper.toEnum('unknown')).toBe(GitInterfaces_1.CommentType.Unknown);
        });
        it('should map enum values to string values correctly', () => {
            expect(index_1.commentTypeMapper.toString(GitInterfaces_1.CommentType.Text)).toBe('text');
            expect(index_1.commentTypeMapper.toString(GitInterfaces_1.CommentType.CodeChange)).toBe('codechange');
            expect(index_1.commentTypeMapper.toString(GitInterfaces_1.CommentType.System)).toBe('system');
            expect(index_1.commentTypeMapper.toString(GitInterfaces_1.CommentType.Unknown)).toBe('unknown');
        });
    });
    describe('pullRequestStatusMapper', () => {
        it('should map string values to enum values correctly', () => {
            expect(index_1.pullRequestStatusMapper.toEnum('active')).toBe(GitInterfaces_1.PullRequestStatus.Active);
            expect(index_1.pullRequestStatusMapper.toEnum('abandoned')).toBe(GitInterfaces_1.PullRequestStatus.Abandoned);
            expect(index_1.pullRequestStatusMapper.toEnum('completed')).toBe(GitInterfaces_1.PullRequestStatus.Completed);
        });
        it('should map enum values to string values correctly', () => {
            expect(index_1.pullRequestStatusMapper.toString(GitInterfaces_1.PullRequestStatus.Active)).toBe('active');
            expect(index_1.pullRequestStatusMapper.toString(GitInterfaces_1.PullRequestStatus.Abandoned)).toBe('abandoned');
            expect(index_1.pullRequestStatusMapper.toString(GitInterfaces_1.PullRequestStatus.Completed)).toBe('completed');
        });
    });
    describe('gitVersionTypeMapper', () => {
        it('should map string values to enum values correctly', () => {
            expect(index_1.gitVersionTypeMapper.toEnum('branch')).toBe(GitInterfaces_1.GitVersionType.Branch);
            expect(index_1.gitVersionTypeMapper.toEnum('commit')).toBe(GitInterfaces_1.GitVersionType.Commit);
            expect(index_1.gitVersionTypeMapper.toEnum('tag')).toBe(GitInterfaces_1.GitVersionType.Tag);
        });
        it('should map enum values to string values correctly', () => {
            expect(index_1.gitVersionTypeMapper.toString(GitInterfaces_1.GitVersionType.Branch)).toBe('branch');
            expect(index_1.gitVersionTypeMapper.toString(GitInterfaces_1.GitVersionType.Commit)).toBe('commit');
            expect(index_1.gitVersionTypeMapper.toString(GitInterfaces_1.GitVersionType.Tag)).toBe('tag');
        });
    });
});
//# sourceMappingURL=index.spec.unit.js.map