/**
 * hyperiot Algorithm
 * HyperIoT Algorithm API
 *
 * OpenAPI spec version: 2.0.0
 * Contact: users@acsoftware.it
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { Algorithm } from '../../../models/algorithm';
import { AlgorithmConfig } from '../../../models/algorithmConfig';
import { AlgorithmIOField } from '../../../models/algorithmIOField';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../../../models/configuration';


@Injectable()
export class AlgorithmsService {

    protected basePath = '/hyperiot/algorithms';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * /hyperiot/algorithms/{id}/ioFields
     * Service for adding IO field
     * @param id The algorithm which must be updated
     * @param body The IO field which must be added
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addIOField(id: number, body: AlgorithmIOField, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public addIOField(id: number, body: AlgorithmIOField, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public addIOField(id: number, body: AlgorithmIOField, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public addIOField(id: number, body: AlgorithmIOField, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling addIOField.');
        }

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling addIOField.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/${encodeURIComponent(String(id))}/ioFields`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /module/status
     * Simple service for checking module status
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public checkModuleWorking(observe?: 'body', reportProgress?: boolean): Observable<any>;
    public checkModuleWorking(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public checkModuleWorking(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public checkModuleWorking(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<any>(`${this.basePath}/module/status`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{id}
     * Service for deleting a algorithm entity
     * @param id The algorithm id which must be deleted
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteAlgorithm(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public deleteAlgorithm(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public deleteAlgorithm(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public deleteAlgorithm(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteAlgorithm.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.delete<any>(`${this.basePath}/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{id}/ioFields/{fieldType}/{ioFieldId}
     * Service for deleting IO field
     * @param id The algorithm which must be updated
     * @param fieldType IO field type
     * @param ioFieldId The IO field which must be deleted
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteIOField(id: number, fieldType: 'INPUT' | 'OUTPUT', ioFieldId: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public deleteIOField(id: number, fieldType: 'INPUT' | 'OUTPUT', ioFieldId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public deleteIOField(id: number, fieldType: 'INPUT' | 'OUTPUT', ioFieldId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public deleteIOField(id: number, fieldType: 'INPUT' | 'OUTPUT', ioFieldId: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteIOField.');
        }

        if (fieldType === null || fieldType === undefined) {
            throw new Error('Required parameter fieldType was null or undefined when calling deleteIOField.');
        }

        if (ioFieldId === null || ioFieldId === undefined) {
            throw new Error('Required parameter ioFieldId was null or undefined when calling deleteIOField.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.delete<any>(`${this.basePath}/${encodeURIComponent(String(id))}/ioFields/${encodeURIComponent(String(fieldType))}/${encodeURIComponent(String(ioFieldId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{id}
     * Service for finding algorithm
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findAlgorithm(id: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public findAlgorithm(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public findAlgorithm(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public findAlgorithm(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling findAlgorithm.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<any>(`${this.basePath}/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{algorithmType}/all
     * Service for finding all algorithm entities
     * @param algorithmType The algorithm type 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findAllAlgorithm(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', observe?: 'body', reportProgress?: boolean): Observable<any>;
    public findAllAlgorithm(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public findAllAlgorithm(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public findAllAlgorithm(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (algorithmType === null || algorithmType === undefined) {
            throw new Error('Required parameter algorithmType was null or undefined when calling findAllAlgorithm.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<any>(`${this.basePath}/type/${encodeURIComponent(String(algorithmType))}/all`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/{type}/algorithms
     * Service for finding all algorithm entities
     * @param algorithmType The algorithm type 
     * @param delta 
     * @param page 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findAllAlgorithmPaginated(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', delta?: number, page?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public findAllAlgorithmPaginated(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', delta?: number, page?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public findAllAlgorithmPaginated(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', delta?: number, page?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public findAllAlgorithmPaginated(algorithmType: 'STATISTICS' | 'MACHINE_LEARNING' | 'DEEP_LEARNING', delta?: number, page?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (algorithmType === null || algorithmType === undefined) {
            throw new Error('Required parameter algorithmType was null or undefined when calling findAllAlgorithmPaginated.');
        }



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (delta !== undefined && delta !== null) {
            queryParameters = queryParameters.set('delta', <any>delta);
        }
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<any>(`${this.basePath}/type/${encodeURIComponent(String(algorithmType))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{algorithmId}/baseConfig
     * Service for getting base configuration of algorithm
     * @param algorithmId Algorithm ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getBaseConfig(algorithmId: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getBaseConfig(algorithmId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getBaseConfig(algorithmId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getBaseConfig(algorithmId: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (algorithmId === null || algorithmId === undefined) {
            throw new Error('Required parameter algorithmId was null or undefined when calling getBaseConfig.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<any>(`${this.basePath}/${encodeURIComponent(String(algorithmId))}/baseConfig`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms
     * Service for adding a new algorithm entity
     * @param body Algorithm entity which must be saved 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public saveAlgorithm(body: Algorithm, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public saveAlgorithm(body: Algorithm, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public saveAlgorithm(body: Algorithm, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public saveAlgorithm(body: Algorithm, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling saveAlgorithm.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms
     * Service for updating a algorithm entity
     * @param body Algorithm entity which must be updated 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateAlgorithm(body: Algorithm, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateAlgorithm(body: Algorithm, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateAlgorithm(body: Algorithm, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateAlgorithm(body: Algorithm, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateAlgorithm.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.put<any>(`${this.basePath}/`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{algorithmId}/baseConfig
     * Service for updating base configuration of algorithm
     * @param algorithmId Algorithm ID which updates base configuration for
     * @param body Base config
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateBaseConfig(algorithmId: number, body: AlgorithmConfig, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateBaseConfig(algorithmId: number, body: AlgorithmConfig, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateBaseConfig(algorithmId: number, body: AlgorithmConfig, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateBaseConfig(algorithmId: number, body: AlgorithmConfig, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (algorithmId === null || algorithmId === undefined) {
            throw new Error('Required parameter algorithmId was null or undefined when calling updateBaseConfig.');
        }

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateBaseConfig.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/${encodeURIComponent(String(algorithmId))}/baseConfig`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{id}/ioFields
     * Service for updating IO field
     * @param id The algorithm which must be updated
     * @param body The IO field which must be updated
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateIOField(id: number, body: AlgorithmIOField, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateIOField(id: number, body: AlgorithmIOField, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateIOField(id: number, body: AlgorithmIOField, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateIOField(id: number, body: AlgorithmIOField, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateIOField.');
        }

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateIOField.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.put<any>(`${this.basePath}/${encodeURIComponent(String(id))}/ioFields`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * /hyperiot/algorithms/{algorithmId}/file/{mainClassName}
     * Service for updating algorithm source file
     * @param algorithmId Algorithm ID which updates source file for
     * @param mainClassname Classname containing main method
     * @param body Algorithm source file 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateAlgorithmFile(algorithmId: number, mainClassname: string, body: Blob, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateAlgorithmFile(algorithmId: number, mainClassname: string, body: Blob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateAlgorithmFile(algorithmId: number, mainClassname: string, body: Blob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateAlgorithmFile(algorithmId: number, mainClassname: string, body: Blob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (algorithmId === null || algorithmId === undefined) {
            throw new Error('Required parameter algorithmId was null or undefined when calling updateAlgorithmFile.');
        }

        if (mainClassname === null || mainClassname === undefined) {
            throw new Error('Required parameter mainClassname was null or undefined when calling updateAlgorithmFile.');
        }

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateAlgorithmFile.');
        }

        let headers = this.defaultHeaders;

        // authentication (jwt-auth) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["AUTHORIZATION"]) {
            headers = headers.set('AUTHORIZATION', this.configuration.apiKeys["AUTHORIZATION"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.put<any>(`${this.basePath}/${encodeURIComponent(String(algorithmId))}/file/${encodeURIComponent(String(mainClassname))}`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
